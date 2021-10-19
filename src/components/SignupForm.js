import React, {useState, useRef, useEffect} from 'react'

function SignupForm({ Signup, error }) {

    const [details, setDetails] = useState({name:""});
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false)

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
        
        setHasPhoto(true)
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

        Signup(details)
    } 


    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Signup</h2>
                {(error !== "") ? (<div className="error">{error}</div>) : ""}
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" onChange={e => setDetails({...details, name:e.target.value})} value={details.name}/>
                </div>
                <div className="form-group">
                    <video ref={videoRef}></video>
                    <button onClick={takePhoto}>SNAP!</button>
                </div>
                <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
                    <canvas ref={photoRef}></canvas>
                    <button onClick={closePhoto}>CLOSE</button>
                </div>
                <input type="submit" value="SIGNUP" />
            </div>
        </form>
    )
}

export default SignupForm
