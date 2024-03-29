import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  
  useMutation,
  useQueryClient,
  
} from '@tanstack/react-query'
import { makeRequest} from '../../axios'

export default function Share() {

  const [file, setFile] = useState(null);
  const [description, setDesc] = useState("");

  const upload = async() => {
    try {
      const formData  = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;

    } catch (error) {
      console.log(error);
    }
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] })   //use this to refresh see query key in posts.jsx
    },
  })


  const handleClick = async(e) => {
    e.preventDefault();

    let imgUrl = "";
    if(file){
      imgUrl = await upload();
    }
    mutation.mutate({description, img: imgUrl})
    setDesc("")
    setFile(null)
    
  }

  const {currentUser} = useContext(AuthContext)
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <input type="text" placeholder={`What's on your mind ${currentUser.name}?`} 
          onChange={(e) => setDesc(e.target.value)} value={description}/>
          </div>
          <div className="right">
            {file && <img src={URL.createObjectURL(file)} alt="" className="file"/> }
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} 
            onChange={file => setFile(file.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

