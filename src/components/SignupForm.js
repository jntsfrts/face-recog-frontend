import React, {useState, useRef, useEffect} from 'react'



function SignupForm({ Signup }) {

    const [details, setDetails] = useState({name:"", email:"", face:""});
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false)
    const [hasFace, setHasFace] = useState(false)


    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: {width: 1920, height: 1080}})
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error(err);
            })
            setTimeout(sendFace,2000)
    }


    const sendFace = () => {
        console.log('ON SEND FACE')
        let b64 = takePhoto()

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
                
            },
            body: JSON.stringify({'face': b64.toString()})
        };


        fetch('http://localhost:5000/user/face', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.hasFace == "true") {
                    console.log(`[FACE FOUND] ${data.hasFace}`)
                    setHasFace(data.hasFace)
                } else {
                    setTimeout(sendFace,5000)
                    console.log(`[FACE NOT FOUND]`)
                }
            });
        }



    const takePhoto = () => {
        const width = 414;
        const height = width / (16/9);

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        var canvas = document.getElementById('foto')
        var base64 = canvas.toDataURL("image/jpeg");
        base64 = base64.split("base64,")[1]
        details.face = base64
        
        return base64;
    }

    
    const closePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');

        ctx.clearRect(0,0, photo.width, photo.height);

        setHasPhoto(false);
    }


    useEffect(() => {
        getVideo();
    }, [videoRef])

    const submitHandler = e => {
        e.preventDefault();
        
        console.log("[ON SUBMIT HANDLER] - hasFace: "+  hasFace + " name:" + (details.name != ""))

        if(details.name !== "" && Boolean(hasFace) === true) {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'name':details.name, 'email': details.email , 'face': details.face.toString()})
            };
    
    
            fetch('http://localhost:5000/user/new', requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(data.status == "succesful" && data.name !== "None") {
                        console.log(`[USER LOGGED IN] ${data.name}`)
                        details.name = data.name
                        Signup(details)
                    } else {
                        console.log(`[USER ALREADY EXISTS]`)
                        //alert("OOPS! Não foi possível logar. 😞\nPosicione-se melhor na câmera ou cadastre-se.")
                        if (window.confirm(`OOPS! ${data.name} já possui cadastro. 😞 \nClique em OK para fazer login.`)) 
                        {
                        window.location.href='http://localhost:3000/login';
                        };
                        
                    }
                }).then(console.log("testando ultimo then"));
        }
    }



    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Cadastro</h2>
               
                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input type="text" name="name" id="name" required={true} onChange={e => setDetails({...details, name:e.target.value})} value={details.name}/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Email:</label>
                    <input type="email" name="email" id="email" required={true} onChange={e => setDetails({...details, email:e.target.value})} value={details.email}/>
                </div>
                <div className="form-group">
                    <video ref={videoRef}></video>
                </div>
                <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
                    <canvas id='foto' ref={photoRef}></canvas>
                    <button onClick={closePhoto}>CLOSE</button>
                </div>
                <input type="submit" value="SIGNUP" disabled={!hasFace}/>
            </div>
        </form>
    )
}

export default SignupForm
