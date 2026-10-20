import { Subject, Topic, Lesson, QuizQuestion } from '../types/curriculum';
import { BIO_BOTANY_LESSONS } from './botanyCurriculum';
import { BIO_ZOOLOGY_LESSONS } from './zoologyCurriculum';
import { enrichLessonsWithNanoBananaPro } from './curriculumEnhancer';

const ENRICHED_BOTANY_LESSONS = enrichLessonsWithNanoBananaPro('bio-botany', BIO_BOTANY_LESSONS);
const ENRICHED_ZOOLOGY_LESSONS = enrichLessonsWithNanoBananaPro('bio-zoology', BIO_ZOOLOGY_LESSONS);

export const SPK_CURRICULUM: Subject[] = [
  {
    id: 'bio-botany',
    title: 'Bio-Botany',
    tamilTitle: 'உயிரி தாவரவியல் (Bio-Botany)',
    description: 'Master 12th Standard Samacheer Kalvi Bio-Botany: Complete 10 Chapters with step-by-step interactive slide decks, verified scientist profiles, and public exam questions.',
    themeColor: 'emerald',
    lessons: ENRICHED_BOTANY_LESSONS,
  },
  {
    id: 'bio-zoology',
    title: 'Bio-Zoology',
    tamilTitle: 'உயிரி விலங்கியல் (Bio-Zoology)',
    description: 'Master 12th Standard Samacheer Kalvi Bio-Zoology: Complete 12 Chapters covering reproduction, genetics, human health, biotechnology, and ecology.',
    themeColor: 'blue',
    lessons: ENRICHED_ZOOLOGY_LESSONS,
  },
];

export function getSubjectById(id: string): Subject | undefined {
  if (!id) return SPK_CURRICULUM[0];
  const clean = id.trim().toLowerCase();
  if (clean === 'biology' || clean === 'botany' || clean === 'bio-botany') return SPK_CURRICULUM[0];
  if (clean === 'zoology' || clean === 'bio-zoology') return SPK_CURRICULUM[1];
  return SPK_CURRICULUM.find((s) => s.id === clean || s.title.toLowerCase().includes(clean));
}

export function getLessonById(
  subjectId: string,
  lessonId: string
): { subject: Subject; lesson: Lesson } | undefined {
  const cleanLessonId = (lessonId || '').trim().toLowerCase();
  let resolvedSubjectId = subjectId;
  if (!resolvedSubjectId || resolvedSubjectId === 'biology') {
    if (cleanLessonId.includes('zoo')) {
      resolvedSubjectId = 'bio-zoology';
    } else if (cleanLessonId.includes('bot')) {
      resolvedSubjectId = 'bio-botany';
    }
  }

  const subject = getSubjectById(resolvedSubjectId);
  if (!subject) return undefined;
  
  // 1. Direct ID match
  let lesson = subject.lessons.find((l) => l.id.toLowerCase() === cleanLessonId);
  
  // 2. Numeric match (e.g. '2' or 'ch-2' or 'chapter-2')
  if (!lesson) {
    const numMatch = cleanLessonId.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      lesson = subject.lessons.find((l) => l.number === num);
    }
  }

  // 3. Title/Slug match (e.g. 'reproduction' or 'human-reproduction')
  if (!lesson) {
    const normalized = cleanLessonId.replace(/-/g, ' ');
    lesson = subject.lessons.find((l) => l.title.toLowerCase().includes(normalized));
  }

  if (!lesson) return undefined;
  return { subject, lesson };
}

export function getTopicById(
  subjectId: string,
  lessonId: string,
  topicId: string
): { subject: Subject; lesson: Lesson; topic: Topic } | undefined {
  const cleanTopicId = (topicId || '').trim().toLowerCase();
  let effectiveSubjectId = subjectId;
  if (!effectiveSubjectId || effectiveSubjectId === 'biology') {
    if (cleanTopicId.endsWith('-z') || cleanTopicId.includes('zoo')) {
      effectiveSubjectId = 'bio-zoology';
    } else if (cleanTopicId.endsWith('-b') || cleanTopicId.includes('bot')) {
      effectiveSubjectId = 'bio-botany';
    }
  }

  const result = getLessonById(effectiveSubjectId, lessonId);
  if (!result) return undefined;
  const cleanId = cleanTopicId;

  // 1. Try finding topic directly
  let topic = result.lesson.topics.find(
    (t) =>
      t.id.toLowerCase() === cleanId ||
      t.number === topicId ||
      t.number === cleanId.replace(/^topic-/, '').replace(/-[zb]$/, '')
  );

  // 2. Slug match (e.g. 'human-reproduction' or '2')
  if (!topic) {
    const numMatch = cleanId.match(/\d+/);
    if (numMatch) {
      const numStr = numMatch[0];
      topic = result.lesson.topics.find((t) => t.number.startsWith(numStr) || t.number === numStr);
    }
  }

  // 3. Fallback to first topic of lesson if not found
  if (!topic && result.lesson.topics.length > 0) {
    topic = result.lesson.topics[0];
  }

  if (!topic) return undefined;
  return { subject: result.subject, lesson: result.lesson, topic };
}

export function findTopicByGlobalNumber(
  numberStr: string,
  preferredSubjectId?: string
): { subject: Subject; lesson: Lesson; topic: Topic } | undefined {
  const clean = numberStr.trim();
  const isZoologyPreferred =
    preferredSubjectId?.toLowerCase().includes('zoo') ||
    clean.endsWith('-z') ||
    clean.includes('zoo');

  const orderedSubjects = isZoologyPreferred
    ? [SPK_CURRICULUM[1], SPK_CURRICULUM[0]]
    : SPK_CURRICULUM;

  for (const subject of orderedSubjects) {
    if (!subject) continue;
    for (const lesson of subject.lessons) {
      for (const topic of lesson.topics) {
        if (
          topic.number === clean ||
          topic.id === clean ||
          topic.id === `topic-${clean}` ||
          topic.id === `topic-${clean}-z` ||
          topic.id === `topic-${clean}-b`
        ) {
          return { subject, lesson, topic };
        }
      }
    }
  }
  return undefined;
}

export function getAllVerifiedTopics(): any[] {
  const list: any[] = [];
  for (const subject of SPK_CURRICULUM) {
    for (const lesson of subject.lessons) {
      for (const topic of lesson.topics) {
        list.push({
          ...topic,
          topicNumber: topic.number,
          chapterNumber: lesson.number,
          subjectTitle: subject.title,
          subjectId: subject.id,
        });
      }
    }
  }
  return list;
}

export function getAllQuizQuestions(subjectId?: string): QuizQuestion[] {
  const list: QuizQuestion[] = [];
  for (const subject of SPK_CURRICULUM) {
    if (subjectId && subjectId !== 'all' && subject.id !== subjectId) continue;
    for (const lesson of subject.lessons) {
      for (const topic of lesson.topics) {
        list.push(...topic.quiz);
      }
    }
  }
  return list;
}
