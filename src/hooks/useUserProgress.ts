
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

interface CourseProgress {
  courseId: number;
  lessonsCompleted: number;
  totalLessons: number;
  progressPercentage: number;
  courseScore: number;
  courseCompleted: boolean;
}

export const useUserProgress = (user: User | null) => {
  const [totalScore, setTotalScore] = useState(0);
  const [courseProgresses, setCourseProgresses] = useState<Record<number, CourseProgress>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserTotalScore = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_total_score', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching total score:', error);
        return;
      }

      setTotalScore(data || 0);
    } catch (error) {
      console.error('Error fetching total score:', error);
    }
  };

  const fetchCourseProgress = async (courseId: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_user_course_progress', {
        user_uuid: user.id,
        course_id_param: courseId
      });

      if (error) {
        console.error('Error fetching course progress:', error);
        return null;
      }

      const progressData = data?.[0];
      if (progressData) {
        const courseProgress: CourseProgress = {
          courseId,
          lessonsCompleted: progressData.lessons_completed,
          totalLessons: progressData.total_lessons,
          progressPercentage: progressData.progress_percentage,
          courseScore: progressData.course_score,
          courseCompleted: progressData.course_completed
        };

        setCourseProgresses(prev => ({
          ...prev,
          [courseId]: courseProgress
        }));

        return courseProgress;
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }

    return null;
  };

  const updateLessonProgress = async (courseId: number, lessonId: number, score: number = 0) => {
    if (!user) return;

    setIsLoading(true);
    console.log(`Updating lesson progress for course ${courseId}, lesson ${lessonId} with score ${score}`);
    
    try {
      // First, check if this lesson was already completed
      const { data: existingProgress } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .single();

      // If lesson already completed, don't update again
      if (existingProgress?.completed) {
        console.log('Lesson already completed, skipping update');
        setIsLoading(false);
        return;
      }

      // Update lesson progress
      const { error: lessonError } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          score: score,
          completed_at: new Date().toISOString()
        });

      if (lessonError) {
        console.error('Error updating lesson progress:', lessonError);
        setIsLoading(false);
        return;
      }

      console.log('Lesson progress updated successfully');

      // Get current course progress or initialize if it doesn't exist
      let currentProgress = courseProgresses[courseId];
      if (!currentProgress) {
        // Initialize course progress if it doesn't exist
        await initializeCourseProgress(courseId, 12); // Default to 12 lessons for Constitutional Foundations
        currentProgress = await fetchCourseProgress(courseId);
      }

      if (currentProgress) {
        // Calculate new values
        const newLessonsCompleted = currentProgress.lessonsCompleted + 1;
        const newCourseScore = currentProgress.courseScore + score;
        const courseCompleted = newLessonsCompleted >= currentProgress.totalLessons;
        const newProgressPercentage = Math.round((newLessonsCompleted / currentProgress.totalLessons) * 100);

        console.log(`Updating course progress: ${newLessonsCompleted}/${currentProgress.totalLessons} lessons (${newProgressPercentage}%)`);

        // Update course progress
        const { error: courseError } = await supabase
          .from('user_course_progress')
          .upsert({
            user_id: user.id,
            course_id: courseId,
            lessons_completed: newLessonsCompleted,
            total_lessons: currentProgress.totalLessons,
            course_score: newCourseScore,
            course_completed: courseCompleted,
            updated_at: new Date().toISOString()
          });

        if (courseError) {
          console.error('Error updating course progress:', courseError);
          setIsLoading(false);
          return;
        }

        console.log('Course progress updated successfully');

        // Update local state immediately
        setCourseProgresses(prev => ({
          ...prev,
          [courseId]: {
            ...currentProgress,
            lessonsCompleted: newLessonsCompleted,
            courseScore: newCourseScore,
            courseCompleted: courseCompleted,
            progressPercentage: newProgressPercentage
          }
        }));
      }

      // Refresh data from database to ensure consistency
      await fetchCourseProgress(courseId);
      await fetchUserTotalScore();
      
      console.log('Progress update completed');
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCourseProgress = async (courseId: number, totalLessons: number) => {
    if (!user) return;

    console.log(`Initializing course progress for course ${courseId} with ${totalLessons} lessons`);

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lessons_completed: 0,
          total_lessons: totalLessons,
          course_score: 0,
          course_completed: false
        });

      if (error) {
        console.error('Error initializing course progress:', error);
        return;
      }

      await fetchCourseProgress(courseId);
      console.log('Course progress initialized successfully');
    } catch (error) {
      console.error('Error initializing course progress:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserTotalScore();
    } else {
      setTotalScore(0);
      setCourseProgresses({});
    }
  }, [user]);

  return {
    totalScore,
    courseProgresses,
    isLoading,
    fetchCourseProgress,
    updateLessonProgress,
    initializeCourseProgress,
    refreshTotalScore: fetchUserTotalScore
  };
};
