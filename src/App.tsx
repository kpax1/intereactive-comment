import React, { useEffect, useReducer } from "react";
import axios from "axios";
import "./emzo.css";
import { useState } from "react";
import useIdentUser from "./hooks/useIdentUser";
interface StateType {
  count: number;
  user: boolean;
  input: string;
  editvalue:string,
  reply: boolean;
  replyinput: any;
  realcomments: []; // Update type definition
}

interface ActionType {
  type: string;
  payload?: any; // Update type definition
}

let initialState: StateType = {
  count: 0,
  user: false,
  input: "",
  editvalue:'',
  replyinput: "",
  realcomments: [],
  reply: false,
};

////styled components

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + 1,
      };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "changecomment":
      return {
        ...state,
        comment: { maxo: action.payload as string },
      };
    case "success-response":
      return {
        ...state,
        realcomments: action.payload.comments as any,
      };

    case "addcomment":
      return {
        ...state,
        input: "",
        realcomments: [
          ...state.realcomments,
          {
            id: action.payload,
            content: action.payload,
            createdAt: "now",
            score: 5,
            replies: [],
            user: {
              image: {
                png: "./images/avatars/image-juliusomo.png",
                webp: "./images/avatars/image-juliusomo.webp",
              },
              username: "juliusomo",
            },
          },
        ],
      };

    case "addreply":
      const { commentId, replyinput } = action.payload;
      return {
        ...state,
        replyinput: "",

        realcomments: state.realcomments.map((comment: any) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: replyinput,
                  content: `${replyinput}`,
                  replyingTo: comment.user.username,
                  user: {
                    image: {
                      png: "./images/avatars/image-juliusomo.png",
                      webp: "./images/avatars/image-juliusomo.webp",
                    },
                    username: "juliusomo",
                  },
                },
              ],
            };
          }

          return comment;
        }),
      };

    case "deletecomment":
      const comId = action.payload;
      return {
        ...state,
        realcomments: state.realcomments.filter(
          (comment: any) => comment.id !== comId
        ),
      };

    case "deletereply":
      const replyId = action.payload;
      return {
        ...state,
        realcomments: state.realcomments.map((comment: any) => {
          // Check if the comment has replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.filter(
                (reply: any) => reply.id !== replyId
              ),
            };
          }
          // Return the comment as it is if it doesn't have any replies
          return comment;
        }),
      };

    case "replyinputvalue":
      return {
        ...state,
        replyinput: action.payload,
      };

    case "addinput":
      return {
        ...state,
        input: action.payload,
      };

      case 'editComment':
        const { commentIid, editedComment } = action.payload;
        return {
          ...state,
          realcomments: state.realcomments.map((comment: any) => {
            if (comment.id === commentIid) {
              return {
                ...comment,
                content:  editedComment,
              };
            }
            return comment;
          }),
        };
      


        case 'editing':
          const commentValue = action.payload;
          return {
            ...state,
            editvalue: commentValue,
          };
        

      
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  //adding input as a comment
  const addaComment = () => {
    dispatch({ type: "addcomment", payload: state.input });
  };

  //delete
  const deleteComment = (comId: string) => {
    dispatch({ type: "deletecomment", payload: comId });
  };

  const deleteReplie = (replyId: string) => {
    dispatch({ type: "deletereply", payload: replyId });
  };

  const editComent = (e: React.ChangeEvent<HTMLTextAreaElement>, commentIid: string) => {
    const editedComment = e.target.value;
    dispatch({ type: 'editComment', payload: { commentIid, editedComment } });
  };
  

  const editCom = (commentValue: string, setIsEdit: any) => {
    setIsEdit(true);
    dispatch({ type: 'editing', payload: commentValue });
  };
  


  //addreply
  const addReply = (
    commentId: any,
    replyinput: any,
    setIsReplying: any,
    replyingTo: any,
    replie: any
  ) => {
    dispatch({
      type: "addreply",
      payload: { commentId, replyinput, replyingTo, replie },
    });
    setIsReplying(false);
  };

  //adding input value
  const addinput = (e: any) => {
    e.preventDefault();

    dispatch({ type: "addinput", payload: e.target.value });
  };

  const replyinputvalue = (e: any) => {
    e.preventDefault();

    dispatch({ type: "replyinputvalue", payload: e.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("./data/data.json");
        dispatch({ type: "success-response", payload: response.data });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="diiv">
        {state.realcomments.map((comment: any) => (
          <CommentItem
            comment={comment}
            addReply={addReply}
            state={state}
            addinput={addinput}
            replyinputvalue={replyinputvalue}
            deleteComment={deleteComment}
            deleteReplie={deleteReplie}
            editComent={editComent}
            key={comment.id}
            editCom={editCom}
          />
        ))}

        <textarea value={state.input} onChange={addinput} />

        <button onClick={addaComment}>add a comment</button>
      </div>
    </>
  );
}

export default App;

const CommentItem = ({
  comment,
  addReply,
  state,
  replyinputvalue,
  deleteComment,
  deleteReplie,
  editComent,
  editCom
}: any) => {
  const [isReplying, setIsReplying] = useState(false);

  const julio = useIdentUser(comment.user.username);
  const [isEdit,setIsedit] = useState(false);

  return (
    <div key={comment.id} className="ind">
      <div className="commentheeader">
      <img  className="profile" src={comment.user.image.webp} alt="" />
      <h2>{comment.user.username}</h2>
      </div>
      <p>  
      {comment.content}
      </p>
      
      {!julio ? (
        <>
          {isReplying ? (
            <>
              <button onClick={() => setIsReplying(false)}>Cancel</button>
              <input
                type="text"
                onChange={replyinputvalue}
                value={state.replyinput}
              />
              <button
                onClick={() =>
                  addReply(comment.id, state.replyinput, setIsReplying)
                }
              >
                Submit Reply
              </button>
            </>
          ) : (
            <div className="replieSection">
            <button className="reply" onClick={() => setIsReplying(true)}> <img src="../public/images/icon-reply.svg"/> Reply</button>
            </div>
          )}
        </>
      ) : (
        <div>
          {!isEdit ?
          <>
          <button  onClick={()=>editCom(comment.content,setIsedit)}>  edit </button>
          </>
          :<>
      <textarea value={comment.content} onChange={(e) => editComent(e, comment.id)} />
      <button onClick={()=>setIsedit(false)}> submit edit</button>
          </>
          }
          
          <button onClick={() => deleteComment(comment.id)}> delete </button>
        </div>
      )}
  <div className='comreplies'>
    
      {comment.replies.map((replie: any) => (
        <ReplyItem
          replie={replie}
          replyinputvalue={replyinputvalue}
          addReply={addReply}
          state={state}
          comment={comment}
          deleteReplie={deleteReplie}
          key={replie.id}
        />
      ))}
      </div>
    </div>
  );
};

const ReplyItem = ({
  replie,
  replyinputvalue,
  addReply,
  state,
  comment,
  deleteReplie,
}: any) => {
  const [isReplying, setIsReplying] = useState(false);

  const julio = useIdentUser(replie.user.username);


  return (
    <>
      <div key={replie.id} className="pp">
        <div className="repliecomment">
      <div className="commentheeader">

        <img src={replie.user.image.webp} alt="" />
        <h2>{replie.user.username}</h2>
        </div>
        <span className="replieto"> {`@${replie.replyingTo}`}</span>
        {replie.content}

        {!julio ? (
          <>
            {isReplying ? (
              <>
                <button onClick={() => setIsReplying(false)}>Cancel</button>
                <input
                  type="text"
                  onChange={replyinputvalue}
                  value={state.replyinput}
                />
                <button
                  onClick={() =>
                    addReply(
                      comment.id,
                      state.replyinput,
                      setIsReplying,
                      replie
                    )
                  }
                >
                  Submit Reply
                </button>
              </>
            ) : (
              <button onClick={() => setIsReplying(true)}>Reply</button>
            )}
          </>
        ) : (
          <div>
            <button onClick={() => deleteReplie(replie.id)}>delete</button>
          </div>
        )}
      </div>
      </div>
    </>
  );
};
