import React, {useState, useRef, useEffect} from 'react'



function SignupForm({ Signup }) {

    const [details, setDetails] = useState({name:"", face:""});
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false)
    const [hasFace, setHasFace] = useState(false)

    let testeFace = false;
    let hasFace2 = false;
    

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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer my-token',
                'My-Custom-Header': 'foobar'
            },
            body: JSON.stringify({'face': b64.toString()})
        };


        fetch('http://localhost:5000/login/face', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.hasFace == "true") {
                    console.log(`[FACE FOUND] ${data.hasFace}`)
                    setHasFace(data.hasFace)
                } else {
                    setTimeout(sendFace,5000)
                    console.log(`[FACE NOT FOUND]`)
                }
            }).then(console.log("testando ultimo then"));
            
            //.then(data => setHasFace(data.hasFace)); OK
            
            //.then(data => setHasFace( data.hasFace ))
            //.then(data => this.setState({ postId: data.id }));
        /*
        
        const request = () => (async () => {
            const rawResponse = await fetch('http://localhost:5000/login/face', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'face': b64.toString()})
            }).catch();
            
            let content = await rawResponse.json();
            
            console.log(JSON.stringify(content));
            
            //console.log("HAS FACE BEFORE", hasFace)
   
            //hasFace = content['hasFace']
            hasFace2 = content['hasFace'] == "true"
            
            console.log("Estado do hasFace2", hasFace2)
            
          })();
          */
          //let teste = ""
          
          //teste = request().then()   
          
          /*

          if(hasFace == false) {
            console.log('TRYING TO SEND FACE AGAIN')
            setTimeout(sendFace,5000)
            }
            */
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

        // trying to get base64

        var canvas = document.getElementById('foto')
        var base64 = canvas.toDataURL("image/jpeg");
        base64 = base64.split("base64,")[1]
        details.face = base64
        //setHasPhoto(true)
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
            console.log("pré signup")
            Signup(details)
            console.log("pós signup")

            const request = () => (async () => {
                const rawResponse = await fetch('http://localhost:5000/signup', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                                            'name':details.name,
                                            'face': details.face.toString()
                                        })
                }).catch();
                
                let content = await rawResponse.json();
                
                console.log(`RESPONSE ==> ${JSON.stringify(content)}`);
                
                hasFace2 = content['hasFace']
                
              })();
    
    
              request()
        }

    }



    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Cadastro</h2>
               
                <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <input type="text" name="name" id="name" onChange={e => setDetails({...details, name:e.target.value})} value={details.name}/>
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
