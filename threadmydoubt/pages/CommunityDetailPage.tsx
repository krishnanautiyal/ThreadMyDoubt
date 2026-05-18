import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { User } from '../types';
import AuthPromptModal from '../components/AuthPromptModal';
import { communityService } from '../services/communityService';
import { questionService } from '../services/questionService';
import { answerService } from '../services/answerService';
import { voteService } from '../services/voteService';
import socket from "../socket";
import AcceptedBadge from '../components/AcceptedBadge';

const AnswerComponent: React.FC<{
    answer: any;
    user: User | null;
    onVoteAttempt: () => void;
    isOwner: boolean;
onMarkBest: (answerId: string) => void;
}> = ({ answer, user, onVoteAttempt, isOwner, onMarkBest }) => {
    const [voteCount, setVoteCount] = useState(answer.upvotes || 0);
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | 'none'>('none');

    const handleVote = async (newVote: 'up' | 'down') => {
        if (!user) {
            onVoteAttempt();
            return;
        }

        try {
            const voteType = newVote === 'up' ? 'upvote' : 'downvote';
            const res = await voteService.castVote(answer._id, 'Answer', voteType);
            if (res.success) {
                setVoteCount(res.upvotes);
                if (res.message === 'Vote removed') setVoteStatus('none');
                else setVoteStatus(newVote);
            }
        } catch (err: any) {
            console.error("Failed to cast vote", err);
        }
    };

    return (
        <div className={`flex items-start gap-4 py-4 border-t 
    ${answer.isAccepted ? 'bg-green-50 border-green-400' : 'border-[color:var(--border-soft)]'}
`}>   
            <div className="flex flex-col items-center gap-1">
                <button onClick={() => handleVote('up')} className={`text-xl transition-colors ${voteStatus === 'up' ? 'text-[color:var(--accent)]' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}>
                    <i className="fas fa-caret-up"></i>
                </button>
                <span className="font-bold text-md text-[color:var(--text-strong)]">{voteCount}</span>
                <button onClick={() => handleVote('down')} className={`text-xl transition-colors ${voteStatus === 'down' ? 'text-blue-500' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}>
                    <i className="fas fa-caret-down"></i>
                </button>
            </div>
            <div className="flex-grow">
                <p className="text-[color:var(--text-normal)]">{answer.body}</p>
                
                <div className="flex items-center gap-2 mt-3 text-xs text-[color:var(--text-muted)]">
                    <img src={answer.authorId?.profilePicture || `https://i.pravatar.cc/150?u=${answer.authorId?.username}`} alt="User Avatar" className="w-5 h-5 rounded-full" />
                    <span className="font-semibold text-[color:var(--text-normal)]">{answer.authorId?.username}</span>
                    <span>•</span>
                    <span>answered {new Date(answer.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
    {answer.isAccepted && <AcceptedBadge />}

    {isOwner && !answer.isAccepted && (
        <button
            onClick={() => onMarkBest(answer._id)}
            className="text-sm text-[color:var(--accent)] hover:text-[color:var(--accent-soft)] transition-colors"
        >
            Mark as Best Answer
        </button>
    )}
</div>
            </div>
        </div>
    );
};

const AddAnswerForm: React.FC<{
    user: User;
    onAddAnswer: (body: string) => void;
}> = ({ user, onAddAnswer }) => {
    const [body, setBody] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (body.trim()) {
            onAddAnswer(body);
            setBody('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 pt-4 border-t border-[color:var(--border-soft)]">
            <h4 className="text-md font-semibold text-[color:var(--text-strong)] mb-2">Your Answer</h4>
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="w-full p-2.5 input-field mb-3"
                placeholder={`Replying as ${user.username}...`}
                required
            />
            <button type="submit" className="bg-[color:var(--accent)] text-white font-bold py-2.5 px-6 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-colors">
                Post Answer
            </button>
        </form>
    );
};

const QuestionThread: React.FC<{
    question: any;
    questions: any[];
    user: User | null;
    onVoteAttempt: () => void;
    setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
}> = ({
    question,
    questions,
    user,
    onVoteAttempt,
    setQuestions
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [answers, setAnswers] = useState<any[]>([]);
    const [voteCount, setVoteCount] = useState(question.upvotes || 0);
    const [voteStatus, setVoteStatus] = useState<'up' | 'down' | 'none'>('none');
    const [loadingAnswers, setLoadingAnswers] = useState(false);

    useEffect(() => {
        if (showDetails && answers.length === 0) {
            setLoadingAnswers(true);
            answerService.getAnswersByQuestion(question._id).then(res => {
                if (res.success) {
                    setAnswers(res.data);
                }
            }).catch(err => {
                console.error("Failed to load answers", err);
            }).finally(() => {
                setLoadingAnswers(false);
            });
        }
    }, [showDetails, question._id, answers.length]);

    useEffect(() => {
    if (!showDetails) return;

    const questionId = question._id;

    // 🔥 Join room
    socket.emit("joinQuestion", questionId);

    // 🔥 Listen for new answers
    socket.on("newAnswer", (data: any) => {
        if (data.questionId === questionId) {
            setAnswers(prev => {
                const exists = prev.some(a => a._id === data.answer._id);
                if (exists) return prev;

                return [...prev, data.answer];
            });
        }
    });

    socket.on("bestAnswerUpdated", (data: any) => {
    if (data.questionId === questionId) {
        setAnswers(prev =>
            prev.map(a => ({
                ...a,
                isAccepted: a._id === data.answerId
            }))
        );
    }
});

    return () => {
    socket.off("newAnswer");
    socket.off("bestAnswerUpdated");
};
}, [showDetails, question._id]);






    const handleVote = async (newVote: 'up' | 'down') => {
        if (!user) {
            onVoteAttempt();
            return;
        }
        try {
            const voteType = newVote === 'up' ? 'upvote' : 'downvote';
            const res = await voteService.castVote(question._id, 'Question', voteType);
            if (res.success) {
                setVoteCount(res.upvotes);
                if (res.message === 'Vote removed') setVoteStatus('none');
                else setVoteStatus(newVote);
            }
        } catch (err: any) {
            console.error("Failed to cast vote", err);
        }
    };


  const handleDeleteQuestion = async () => {

    try {

        const res = await questionService.deleteQuestion(
            question._id
        );

        if (res.success) {

            setQuestions(prev =>
                prev.filter(
                    q => q._id !== question._id
                )
            );

        }

    } catch (err) {

        console.log(err);

    }
};
    const handleAddAnswer = async (body: string) => {
        if (!user) return;
        try {
            const res = await answerService.createAnswer({
                questionId: question._id,
                body
            });
            if (res.success) {
    setAnswers(prev => {
        const exists = prev.some(a => a._id === res.data._id);
        if (exists) return prev;
        return [...prev, res.data];
    });
}
        } catch (err: any) {
            alert(err.message || 'Error posting answer');
        }
    };


  const handleMarkBest = async (answerId: string) => {
    try {
        const res = await answerService.markBestAnswer(answerId);
        console.log("SUCCESS:", res);

        if (res.success) {
            setAnswers(prev =>
                prev
                    .map(a => ({
                        ...a,
                        isAccepted: a._id === answerId
                    }))
                    .sort((a, b) => Number(b.isAccepted) - Number(a.isAccepted))
            );
        }

    } catch (err: any) {
        console.log("ERROR RESPONSE:", err);
    }
};

    return (
        <article key={question._id} className="bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] border border-[color:var(--border-soft)] transition-shadow hover:shadow-md">
            <div className="p-5 flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                    <button onClick={() => handleVote('up')} className={`text-xl transition-colors ${voteStatus === 'up' ? 'text-[color:var(--accent)]' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}>
                        <i className="fas fa-caret-up"></i>
                    </button>
                    <span className="font-bold text-lg text-[color:var(--text-strong)]">{voteCount}</span>
                    <button onClick={() => handleVote('down')} className={`text-xl transition-colors ${voteStatus === 'down' ? 'text-blue-500' : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)]'}`}>
                        <i className="fas fa-caret-down"></i>
                    </button>
                </div>
                <div
    className="flex-grow cursor-pointer"
    onClick={() => setShowDetails(!showDetails)}
>

    <div className="flex items-center justify-between gap-4">

        <h3 className="text-lg font-semibold text-[color:var(--text-strong)] flex items-center gap-2">

            {question.title}

            {question.image && (
                <i
                    className="fas fa-image text-[color:var(--accent)] text-sm"
                    title="Contains image"
                ></i>
            )}

        </h3>

        {String(question.authorId?._id) === String(user?.id) && (

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion();
                }}
                className="text-red-500 hover:text-red-400 text-sm"
            >
                Delete
            </button>

        )}

    </div>

    <div className="flex items-center gap-4 text-xs text-[color:var(--text-muted)] mt-2">

        <span>
            Posted on {new Date(question.createdAt).toLocaleDateString()}
        </span>

        <span>•</span>

        <span className="font-semibold">

            {answers.length > 0
                ? `${answers.length} Answers`
                : 'Click to view/add answers'}

        </span>

    </div>

</div>
                <button onClick={() => setShowDetails(!showDetails)} className="text-[color:var(--text-muted)] text-xl p-2 h-full">
                    <i className={`fas fa-chevron-down transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}></i>
                </button>
            </div>
            {showDetails && (
                <div className="px-5 pb-5 border-t border-[color:var(--border-soft)]">
                    <p className="text-[color:var(--text-normal)] mt-4 mb-6">{question.body}</p>
                    {question.image && (
    <div className="mb-6">
        <img
            src={question.image}
            alt="Question attachment"
            className="
                rounded-xl
                max-h-[500px]
                w-full
                object-contain
                border
                border-[color:var(--border-soft)]
                bg-[color:var(--bg-elevated)]
            "
        />
    </div>
)}
                    <h4 className="text-lg font-semibold text-[color:var(--text-strong)] mb-2">
                        Answers
                    </h4>
                    {loadingAnswers ? (
                        <div className="text-center py-4"><i className="fas fa-spinner fa-spin text-[color:var(--accent)]"></i> Loading answers...</div>
                    ) : (
                        <div className="space-y-2">
                            {answers.length > 0 ? (
                                answers.map(answer => (
    <AnswerComponent
        key={answer._id}
        answer={answer}
        user={user}
        onVoteAttempt={onVoteAttempt}
        isOwner={String(question.authorId?._id) === String(user?.id)}
        onMarkBest={handleMarkBest}
    />
))
                            ) : (
                                <p className="text-[color:var(--text-muted)] py-4 text-center">Be the first to share your knowledge!</p>
                            )}
                        </div>
                    )}
                    {user ? (
                        <AddAnswerForm user={user} onAddAnswer={handleAddAnswer} />
                    ) : (
                        <div className="mt-6 pt-4 border-t border-[color:var(--border-soft)] text-center">
                            <button onClick={onVoteAttempt} className="font-semibold text-[color:var(--accent)] hover:underline">Log in or sign up to leave an answer</button>
                        </div>
                    )}
                </div>
            )}
        </article>
    );
};

interface CommunityDetailPageProps {
    user: User | null;
    onAskQuestion: (communityId: string | number) => void;
}

const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({ user, onAskQuestion }) => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [community, setCommunity] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchCommunityData = async () => {
        if (!slug) return;

        setLoading(true);

        try {
            const commRes = await communityService.getCommunity(slug);

            if (commRes.success) {
                const comm = commRes.data; // ✅ DEFINE HERE
                setCommunity(comm);

                const questRes = await questionService.getQuestions({
                    communityId: comm._id // ✅ NOW VALID
                });

                if (questRes.success) {
                    setQuestions(questRes.data);
                }
            }

        } catch (err) {
            console.error("Failed to load community details", err);
        } finally {
            setLoading(false);
        }
    };

    fetchCommunityData();
}, [slug]);

useEffect(() => {

    const handleNewQuestion = (question: any) => {

        setQuestions(prev => {

            const exists = prev.some(
                q => q._id === question._id
            );

            if (exists) return prev;

            return [question, ...prev];

        });

    };

    const handleQuestionDeleted = (data: any) => {

        setQuestions(prev =>
            prev.filter(
                q => q._id !== data.questionId
            )
        );

    };

    socket.on(
        "newQuestion",
        handleNewQuestion
    );

    socket.on(
        "questionDeleted",
        handleQuestionDeleted
    );

    return () => {

        socket.off(
            "newQuestion",
            handleNewQuestion
        );

        socket.off(
            "questionDeleted",
            handleQuestionDeleted
        );

    };

}, []);


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-[color:var(--text-muted)]">
                <i className="fas fa-spinner fa-spin text-3xl"></i>
                <p className="mt-4">Loading Community...</p>
            </div>
        );
    }

    if (!community) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold text-[color:var(--text-strong)]">Community not found</h1>
                <Link to="/communities" className="mt-4 text-[color:var(--accent)] hover:underline block">
                    &larr; Back to all communities
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 animate-fadeInUp">
            <header className="mb-8">
                <Link to="/communities" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-normal)] mb-4 inline-block">
                    &larr; Back to Communities
                </Link>
                <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[color:var(--bg-elevated)] rounded-[var(--radius)] flex items-center justify-center text-3xl text-[color:var(--accent-soft)] flex-shrink-0">
                            <i className={`fas ${community.icon}`}></i>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-[color:var(--text-strong)]">{community.name}</h1>
                            <p className="text-[color:var(--text-normal)]">{community.description}</p>
                        </div>
                    </div>
                    <button onClick={() => user ? onAskQuestion(slug!) : setIsAuthModalOpen(true)} className="bg-[color:var(--accent)] text-white font-bold py-2.5 px-6 rounded-[var(--radius)] hover:bg-[color:var(--accent-soft)] transition-colors flex items-center gap-2 w-full md:w-auto flex-shrink-0">
                        <i className="fas fa-plus-circle"></i> Ask a Question
                    </button>
                </div>
            </header>

            <main>
                <h2 className="text-2xl font-semibold text-[color:var(--text-strong)] mb-4">Threads in {community.name}</h2>
                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <div className="text-center py-12 bg-[color:var(--bg-secondary)] rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border-strong)]">
                            <p className="text-[color:var(--text-muted)]">No questions yet. Be the first to ask!</p>
                        </div>
                    ) : (
                        questions.map(q => (
    <QuestionThread
        key={q._id}
        question={q}
        questions={questions}
        setQuestions={setQuestions}
        user={user}
        onVoteAttempt={() => setIsAuthModalOpen(true)}
    />
))
                    )}
                </div>
            </main>
            <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default CommunityDetailPage;