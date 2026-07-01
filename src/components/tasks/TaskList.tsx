import React from 'react';
import type { LeadTask } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: LeadTask[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};
export default TaskList;
