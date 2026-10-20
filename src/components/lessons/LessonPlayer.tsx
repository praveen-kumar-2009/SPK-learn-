import React from 'react';
import { Topic } from '../../types/curriculum';
import { PowerPointSlideDeck } from './PowerPointSlideDeck';

interface LessonPlayerProps {
  topic: Topic;
  lessonTitle: string;
  subjectTitle: string;
  onAskAI: (context: {
    subjectTitle: string;
    lessonTitle: string;
    topicNumber: string;
    topicTitle: string;
    slideIndex: number;
    slideTitle: string;
    selectedPart?: string;
  }) => void;
  onCompleteTopic?: (topicId: string) => void;
  isCompleted?: boolean;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  topic,
  lessonTitle,
  subjectTitle,
  onAskAI,
  onCompleteTopic,
  isCompleted = false,
}) => {
  return (
    <div className="w-full">
      <PowerPointSlideDeck
        topic={topic}
        lessonTitle={lessonTitle}
        subjectTitle={subjectTitle}
        onAskAI={onAskAI}
        onCompleteTopic={onCompleteTopic}
        isCompleted={isCompleted}
      />
    </div>
  );
};
