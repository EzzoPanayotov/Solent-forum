import React, { useState, useEffect } from 'react'
import Avatar from '@mui/material/Avatar'
import SideBar from './SideBar'
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase'
import { useAuth } from '../Contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import PostButtons from './PostButtons'
import '../App.css'

function YourQuestionsComponent() {

    const { currentUser } = useAuth()
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState('');
    const [postId, setPostId] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
  useEffect(() =>{
      
      const getPosts = async () =>{
          const postsRef = collection(db, 'posts')
          const data = await getDocs(postsRef)
          setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      }
      getPosts();
  }, [])

  
  const deletePost = async (id) =>{
    const postDoc = doc(db, 'posts', id)
    alert('Post Deleted')
    return await deleteDoc(postDoc)
} 

const [openSettings, setOpenSettings] = useState(false);

const getPostId = (id) =>{
    const postIdFromDoc = doc(db, 'posts', id)
    setPostId(postIdFromDoc)
    if(postIdFromDoc.id === id){
        setOpenSettings(!openSettings)
    }
}

const editHandler = async (id) =>{
    const getPost = doc(db, 'posts', id)
    const postData = await getDoc(getPost)
  
    setPost(postData.data())
} 

const handleUserInputChange = (event) =>{
  const {name, value} = event.target;
  setPost((prev) =>{
    return {...prev, [name]: value}
  })
}

const updateHandler = async () =>{
  try {
    if(post.tags === '' || /^ *$/.test(post.tags)){
      return setErrorMessage('Tags field cannot be empty!')
    }
    if(post.title === '' || /^ *$/.test(post.title)){
      return setErrorMessage('Title field cannot be empty!')
    }
    if(post.question === '' || /^ *$/.test(post.question)){
      return setErrorMessage('Question field cannot be empty!')
    }
    await updateDoc(doc(db, 'posts', postId.id),{
      userID : currentUser.uid,
      tags: post.tags,
      title: post.title,
      question: post.question,
      date: new Date().toISOString('YYYY-MM-DD HH:mm:ss'),
      userProfileImg: currentUser.photoURL,
      userName: currentUser.displayName
    })
  } catch (err) {
    if(err){

      setErrorMessage('Could not update post!')
    }
  }
  navigate('/')
}

let tagsArray;
  return (
    <div className='yourQuestionsOuter'>
      <SideBar/>
      { post ?
      <div className='editPostContainer'>
      <div className='editPostMain'>
         <form className='askQuestionForm'>
          {errorMessage && <p className='RegisterError'>{errorMessage}</p>}
            <input type='text' name='tags' placeholder='Your Tags e.g.: #javascript'
                onChange={handleUserInputChange} value={post.tags} required/>

            <input type='text'  name='title' placeholder='Your Title' 
                onChange={handleUserInputChange} value={post.title} required/>

            <textarea className='textareaMain textareaMobile' name='question' placeholder='Type your question' 
                onChange={handleUserInputChange} value={post.question} required/>
          <div className='askQuestionBtns'>
            <Link to='/'>
             <button className='cancelBtn' type='submit'>Cancel</button>
            </Link>
            <button className='addQuestionBtn' type='button' onClick={() => {updateHandler(post.id)}}>
              <img src={process.env.PUBLIC_URL + '/Images/askQuestionIcon.svg'} alt='Post question Icon'/>
              Post</button>
          </div>
        </form>
      </div>
      </div>:''
      }
      <div className='yourQuestionsMainContainer'>
      <div className='yourQuestionsMain'>
        {posts.map((post) => { return <div className='emptyDiv' key={post.id}>
          { currentUser.uid === post.userID ?
          <div className='yourQuestionsCards'>
            <div className='cardHeader'>
                <div className='cardPoster'>
                    <div className='cardPosterImage'>
                        <Avatar className='cardProfileImage'
                            src={post.userProfileImg}
                            sx = {{width: 40, height: 40, position: 'unset'}}/> 
                    </div>
                    <div className='cardPosterName'>
                        <p className='posterName'>{post.userName}</p>
                        <p className='timePosted'>{moment(post.date).local().startOf('seconds').fromNow()}</p>
                    </div>
                </div>
                {currentUser ?
                <div className='cardSettingsOuter'>
                <div className='cardSettingsContainer'>
                    {postId.id === post.id && 
                    <div>
                        {openSettings ? 
                            <div className='cardSettingsBtns'>
                                <button className='editBtn' onClick={() => {editHandler(post.id)}}>Edit</button>
                                <button className='deleteBtn' onClick={() => {deletePost(post.id)}}>Delete</button>
                            </div>:''
                        }
                    </div>
                    } 
                    <button className='cardSettings' 
                        onClick={() => getPostId(post.id)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                </div>:''
                }
            </div>
            <div className='cardMainInfo'>
                <div className='cardTitle'>
                    <p>{post.title}</p>
                </div>
                <div className='cardQuestion'>
                    <p>{post.question}</p>
                </div>
            </div>
            <div className='cardFooter'>
                <div className='cardTags'>
                <div className='cardTags'>
                    <p className='doNotDisplay'>{tagsArray = post.tags.split(' ')}</p>
                    {tagsArray.map((tag) => {return <div className='tag' key={tag}><p>{tag}</p></div>})}
                </div>
                </div>
                    <PostButtons/>
            </div>
            </div>: ''
            }
            </div>
          })}
      </div>
        <div className='yourQuestionsUserImage'>
          <div>
          <Avatar className='avatar'
            src={currentUser.photoURL}
            sx = {{width: 200, height: 200, position: 'unset'}}/> 
            <h2>{currentUser.displayName}</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourQuestionsComponent