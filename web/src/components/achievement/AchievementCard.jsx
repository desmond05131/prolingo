import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';

/**
 * AchievementCard
 * Props:
 *  - title
 *  - description
 *  - reward (string)
 *  - progress: { current: number, total: number }
 *  - status: 'completed' | 'in-progress'
 */
export function AchievementCard({
  title,
  description,
  reward,
  progress,
  status,
  className,
}) {
  const isCompleted = status === 'completed' || (progress && progress.current >= progress.total);

  return (
    <Card className={cn('flex flex-col justify-between hover:shadow-md transition-shadow', className)}>
      <CardContent className='p-5 flex flex-col gap-4'>
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold leading-tight'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        <div className='text-sm font-medium text-blue-600 dark:text-blue-400'>
          {reward}
        </div>
        <div className='mt-auto'>
          {isCompleted ? (
            <Button disabled className='w-full bg-blue-600 hover:bg-blue-600 cursor-default'>Completed</Button>
          ) : (
            <ProgressBar current={progress?.current || 0} total={progress?.total || 0} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AchievementCard;
