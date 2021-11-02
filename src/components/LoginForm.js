import React, {useState, useRef, useEffect} from 'react'

function LoginForm({ Login, error }) {

    const [details, setDetails] = useState({name:""});
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false)
    let hasFace = false;


    const submitHandler = e => {
        e.preventDefault();
        console.log('EM LOGINFORM')
        Login(details)
    } 

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

        let b64 = takePhoto()

        const request = () => (async () => {
            const rawResponse = await fetch('http://localhost:5000/login', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'photo': b64.toString()})
            }).catch();
            
            let content = await rawResponse.json();
            
            console.log(`CONTENT TEST ${JSON.stringify(content.name)}`);
            
            

            if(content.name != "" || content.name != "Undefined") {
                details.name = content.name;
                console.log('Logado', content.name);
                hasFace = true;
            }
            

            
        })();
        
        request()

        if(hasFace == false) {
            setTimeout(sendFace,5000);
        }
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




    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Login</h2>
                {(error !== "") ? (<div className="error">{error}</div>) : ""}
                <div className="form-group">
                    <video ref={videoRef}></video>
                </div>
                <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
                    <canvas id='foto' ref={photoRef}></canvas>
                    <button onClick={closePhoto}>CLOSE</button>
                </div>
                <input type="submit" value="LOGIN" />
            </div>
        </form>
    )
}

export default LoginForm
