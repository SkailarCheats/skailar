"use client"

import { Rating } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { MaxWidthWrapper } from "./MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface Feedback {
  _id: string;
  featured: boolean;
  avatar: string;
  user: string;
  rating: number;
  title: string;
  description: string;
  joinedAt: string;
}

export type FeedbackType = {
  _id: string;
  featured: boolean;
  avatar: string;
  user: string;
  rating: number;
  title: string;
  description: string;
  joinedAt: string;
}

export const ReviewSlider = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/feedbacks')
      .then((response) => response.json())
      .then((data) => {
        setFeedbacks(data);
      })
      .catch((error) => {
        console.error('Error fetching feedbacks:', error);
      });
  }, []);

  const featuredFeedbacks = feedbacks.filter(feedback => feedback.featured);

  const formatReviewDate = (reviewDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(reviewDate).toLocaleDateString(undefined, options);
  };

  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="font-bold text-gray-900 dark:text-gray-50 text-4xl sm:text-4xl">Reviews</h1>
        <div className="flex flex-wrap justify-center gap-8 pt-12">
          {featuredFeedbacks.map((feedback) => (
            <div key={feedback._id} className="flex items-stretch flex-col bg-white dark:bg-black overflow-hidden shadow-lg rounded-lg w-[306px] my-4 ml-4 transition duration-300 ease-in-out transform hover:scale-105">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarImage src={feedback.avatar} />
                      <AvatarFallback>{feedback.user}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{feedback.user}</span>
                  </div>
                  <Rating
                    placeholder=''
                    unratedColor="gray"
                    ratedColor="amber"
                    className="hover:cursor-default"
                    value={feedback.rating}
                    readonly
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feedback.title}</h3>
                <p className="text-sm text-gray-700">{feedback.description}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 py-3 px-4 mt-auto">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="font-light">Joined at: {formatReviewDate(feedback.joinedAt)}</span>
                </div>
              </div>
            </div>
          ))}
          {feedbacks.length > 0 && featuredFeedbacks.length === 0 && (
            <div>
              <p className="text-muted-foreground">
                Not Available Reviews
              </p>
            </div>
          )}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};