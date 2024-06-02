"use client"

import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Feedback } from '@/components/review-slider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { Rating } from "@material-tailwind/react";
import { formatDistanceToNow } from "date-fns";
import { Edit, Info, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";

export const ReviewTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:8080/feedbacks');
        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchFeedbacks();
  }, []);

  const deleteFeedback = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/feedbacks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const remainingFeedbacks = feedbacks.filter((feedback) => feedback._id !== id);
        setFeedbacks(remainingFeedbacks);
        toast.success('Feedback deleted successfully');
      } else {
        toast.error('Failed to delete feedback. Please try again.');
        throw new Error('Failed to delete feedback');
      }
    } catch (error) {
      toast.error('Error deleting feedback. Please try again later.');
      console.error('Error deleting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureToggle = async (id: string, currentFeatured: any) => {
    const feedbackToUpdate = feedbacks.find((feedback) => feedback._id === id);

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/feedbacks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !currentFeatured,
          avatar: feedbackToUpdate?.avatar,
          user: feedbackToUpdate?.user,
          rating: feedbackToUpdate?.rating,
          title: feedbackToUpdate?.title,
          description: feedbackToUpdate?.description,
          joinedAt: feedbackToUpdate?.joinedAt
        }),
      });

      if (response.ok) {
        const updatedFeedback = await response.json();
        const updatedFeedbacks = feedbacks.map((feedback) =>
          feedback._id === id ? updatedFeedback : feedback
        );
        setFeedbacks(updatedFeedbacks);
        toast.success('Feature status updated successfully');
      } else {
        toast.error('Failed to update feature status. Please try again.');
        throw new Error('Failed to update feature status');
      }
    } catch (error) {
      toast.error('Error updating feature status. Please try again later.');
      console.error('Error updating feature status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = feedbacks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const MAX_TITLE_LENGTH = 10;
  const MAX_DESCRIPTION_LENGTH = 25;

  return (
    <MaxWidthWrapper className="mt-10 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">Reviews {feedbacks.length > 0 && `(${feedbacks.length})`}</h1>
      {feedbacks.length > 0 ? (
        <div className="rounded-md border dark:border-gray-800 mt-5">
          <div className='relative w-full overflow-auto'>
            <table className='w-full caption-bottom text-sm'>
              <thead className='[&_tr]:border-b dark:[&_tr]:border-gray-800'>
                <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Avatar</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>User</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Rating</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Title</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Description</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Joined</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Status</th>
                  <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'>Actions</th>
                </tr>
              </thead>

              <tbody className='[&_tr:last-child]:border-0'>
                {currentFeedbacks.map((feedback) => (
                  <tr key={feedback._id} className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Avatar>
                        <AvatarImage src={feedback.avatar} />
                        <AvatarFallback>{feedback.user}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>{feedback.user}</td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Rating placeholder='' ratedColor="amber" unratedColor="amber" value={feedback.rating} readonly   onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      {
                        feedback.title.length > MAX_TITLE_LENGTH
                          ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center gap-1">
                                  <Info className="w-4 h-4 text-muted-foreground" />
                                  {feedback.title.substring(0, MAX_TITLE_LENGTH)}...
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-base text-muted-foreground">
                                    {feedback.title}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                          : feedback.title
                      }
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>
                      {
                        feedback.description.length > MAX_DESCRIPTION_LENGTH
                          ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger className="flex items-center gap-1">
                                  <Info className="w-4 h-4 text-muted-foreground" />
                                  {feedback.description.substring(0, MAX_DESCRIPTION_LENGTH)}...
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-base text-muted-foreground">
                                    {feedback.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                          : feedback.description
                      }
                    </td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>{formatDistanceToNow(new Date(feedback.joinedAt), { addSuffix: true })}</td>
                    <td className='p-4 align-middle [&:has([role=checkbox])]:pr-0'>{feedback.featured ? 'Featured' : 'Pending'}</td>
                    <td className='p-4 space-x-2 align-middle [&:has([role=checkbox])]:pr-0'>
                      <Button onClick={() => handleFeatureToggle(feedback._id, feedback.featured)} variant='secondary' className='hover:bg-white dark:bg-black dark:hover:bg-gray-800' size='sm'>
                        <Edit className='w-4 h-4' />
                      </Button>

                      <Button onClick={() => deleteFeedback(feedback._id)} variant='outline' className='bg-[#ffe4e6] dark:bg-background dark:hover:bg-gray-800' size='sm'>
                        <Trash className='w-4 h-4 text-red-600' />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2">
            <AiOutlineLoading className="animate-spin w-8 h-8" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {!isLoading && feedbacks.length < 0 && (
        <p>No feedbacks available</p>
      )}

      {feedbacks.length > 0 && (
        <div className="flex justify-end items-center space-x-2 p-4">
          <Button
            variant='outline'
            size='sm'
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => paginate(currentPage < Math.ceil(feedbacks.length / itemsPerPage) ? currentPage + 1 : currentPage)}
            disabled={currentPage === Math.ceil(feedbacks.length / itemsPerPage)}
          >
            Next
          </Button>

        </div>
      )}
    </MaxWidthWrapper>
  );
};