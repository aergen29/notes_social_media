import { Link } from 'react-router-dom';
import './comment.css';
import { useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { BsFillTrashFill } from 'react-icons/bs';
const { REACT_APP_IMAGES_URL } = process.env;

const Comment = ({ value, commentDelete }) => {
  const sessionState = useSelector(state => state.session);
  if (!value.userid) return <></>;
  return (
    <>
      <div className="comment-container">
        <div className='comment-user-box'>
          <Link to={`/${value.userid.username}`}>
            <img alt="" src={REACT_APP_IMAGES_URL + value.userid.profile_image} />
            <span> {value.userid.username}</span>
          </Link>
        </div>
        <div className="comment-text-box">
          <p>{value.text}</p>
        </div>
        {sessionState._id === value.userid._id ?
          <>
            <div className='flex-space'></div>
            <div className='delete-button-box'>
              <Button color="danger" size="sm" onClick={() => commentDelete(value._id)}><BsFillTrashFill /></Button>
            </div>
          </> : ''

        }
      </div>
    </>
  )
}

export default Comment;