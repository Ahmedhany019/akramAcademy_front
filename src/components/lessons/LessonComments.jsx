import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  MessageSquare,
  Send,
  Trash2,
  CornerDownLeft,
  ShieldCheck,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  useGetLessonCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useCreateReplyMutation,
  useDeleteReplyMutation,
} from "../../redux/api/apiSlice";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import toast from "react-hot-toast";

function ReplyItem({ reply, lessonId, currentUserId, isAdmin, onDeleteReply }) {
  const isReplyAdmin = reply.user_role === "admin";
  const canDelete = isAdmin || (currentUserId && currentUserId === reply.user_id);

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all ${
        isReplyAdmin
          ? "bg-primary/5 border-primary/20"
          : "bg-gray-50/80 border-surface-border"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              isReplyAdmin
                ? "bg-primary text-white ring-2 ring-primary/20"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {isReplyAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-xs font-bold text-gray-900">
            {reply.user_name || "مستخدم"}
          </span>
          {isReplyAdmin && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white shadow-xs">
              <ShieldCheck className="w-2.5 h-2.5" />
              المعلم / الإدارة
            </span>
          )}
          {reply.created_at && (
            <span className="text-[11px] text-textSecondary">
              {new Date(reply.created_at).toLocaleDateString("ar-EG", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {canDelete && (
          <button
            onClick={() => onDeleteReply(reply.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
            title="حذف الرد"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed pr-9 whitespace-pre-line">
        {reply.reply}
      </p>
    </div>
  );
}

function CommentCard({
  comment,
  lessonId,
  currentUserId,
  isAdmin,
  onDeleteComment,
  onDeleteReply,
  onAddReply,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const isCommentAdmin = comment.user_role === "admin";
  const canDelete = isAdmin || (currentUserId && currentUserId === comment.user_id);
  const replies = comment.replies || [];
  const hasMoreThanTwoReplies = replies.length > 2;
  const displayedReplies = showAllReplies ? replies : replies.slice(0, 2);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      setIsSubmittingReply(true);
      await onAddReply({
        commentId: comment.id,
        reply: replyText.trim(),
        lessonId,
      });
      setReplyText("");
      setShowReplyForm(false);
      setShowAllReplies(true);
    } catch {
      // Handled in parent
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="bg-white border border-surface-border rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-all hover:border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              isCommentAdmin
                ? "bg-primary text-white ring-2 ring-primary/20"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {isCommentAdmin ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-gray-900">
                {comment.user_name || "طالب"}
              </h4>
              {isCommentAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary text-white shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  المعلم / الإدارة
                </span>
              )}
            </div>
            {comment.created_at && (
              <span className="text-[11px] text-textSecondary">
                {new Date(comment.created_at).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => onDeleteComment(comment.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="حذف التعليق"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comment Body */}
      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line pr-1">
        {comment.comment}
      </p>

      {/* Action Footer */}
      <div className="flex items-center gap-3 pt-1 border-t border-surface-border">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          {showReplyForm ? "إلغاء الرد" : "إضافة رد"}
        </button>

        {replies.length > 0 && (
          <span className="text-xs text-textSecondary">
            {replies.length} {replies.length === 1 ? "رد" : "ردود"}
          </span>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="pt-2">
          <div className="flex gap-2 items-end">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك هنا..."
              rows={2}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-surface-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all resize-none"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={isSubmittingReply || !replyText.trim()}
              className="gap-1.5 shrink-0 h-10 px-4"
            >
              {isSubmittingReply ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>رد</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Nested Replies List */}
      {replies.length > 0 && (
        <div className="pt-2 space-y-2.5 pr-3 sm:pr-5 border-r-2 border-primary/20 mr-1 sm:mr-2">
          {displayedReplies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              lessonId={lessonId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onDeleteReply={onDeleteReply}
            />
          ))}

          {/* Show More / Show Less for replies > 2 */}
          {hasMoreThanTwoReplies && (
            <button
              type="button"
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-1"
            >
              {showAllReplies ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  عرض أقل
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  عرض باقي الردود ({replies.length - 2} رد إضافي)
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function LessonComments({ lessonId }) {
  const user = useSelector((state) => state.auth?.user);
  const isAdmin = user?.role === "admin";
  const [commentText, setCommentText] = useState("");

  const {
    data: commentsResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetLessonCommentsQuery(lessonId, {
    skip: !lessonId,
  });

  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [createReply] = useCreateReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();

  const comments = commentsResponse?.data || [];

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        lessonId,
        comment: commentText.trim(),
        userId: user?.id,
      }).unwrap();

      setCommentText("");
      toast.success("تم إضافة تعليقك بنجاح");
    } catch (err) {
      toast.error(err?.data?.message || "حدث خطأ أثناء إضافة التعليق");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

    try {
      await deleteComment({ id: commentId, lessonId }).unwrap();
      toast.success("تم حذف التعليق");
    } catch (err) {
      toast.error(err?.data?.message || "تعذر حذف التعليق");
    }
  };

  const handleAddReply = async ({ commentId, reply }) => {
    try {
      await createReply({
        commentId,
        reply,
        lessonId,
        userId: user?.id,
      }).unwrap();
      toast.success("تم إضافة الرد بنجاح");
    } catch (err) {
      toast.error(err?.data?.message || "تعذر إضافة الرد");
      throw err;
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الرد؟")) return;

    try {
      await deleteReply({ replyId, lessonId }).unwrap();
      toast.success("تم حذف الرد");
    } catch (err) {
      toast.error(err?.data?.message || "تعذر حذف الرد");
    }
  };

  return (
    <div className="bg-white border border-surface-border rounded-3xl p-5 sm:p-7 shadow-card space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-primary">
              الأسئلة والمناقشات
            </h3>
            <p className="text-xs text-textSecondary">
              شارك باستفساراتك حول هذا الدرس وسيقوم المعلم بالرد عليك
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
          {comments.length} تعليق
        </span>
      </div>

      {/* Add New Comment Form */}
      <form onSubmit={handleCreateComment} className="space-y-3">
        <div className="relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="اكتب سؤالك أو تعليقك على هذا الدرس..."
            rows={3}
            className="w-full text-sm p-4 rounded-2xl border border-surface-border bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-hidden transition-all resize-none placeholder:text-gray-400"
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isCreatingComment || !commentText.trim()}
            className="gap-2 px-6"
          >
            {isCreatingComment ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>إرسال التعليق</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-textSecondary">
            <Spinner size="md" />
            <span className="text-xs">جاري تحميل التعليقات...</span>
          </div>
        ) : error ? (
          <div className="py-6 text-center text-xs text-red-500">
            تعذر تحميل التعليقات.
            <button
              onClick={refetch}
              className="text-primary font-bold underline mr-2"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center space-y-2 bg-gray-50/60 rounded-2xl border border-dashed border-surface-border">
            <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />
            <p className="text-sm font-bold text-gray-600">لا توجد تعليقات بعد</p>
            <p className="text-xs text-textSecondary">
              كن أول من يبدأ النقاش ويطرح سؤالاً حول هذا الدرس!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              lessonId={lessonId}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onDeleteComment={handleDeleteComment}
              onDeleteReply={handleDeleteReply}
              onAddReply={handleAddReply}
            />
          ))
        )}
      </div>
    </div>
  );
}
