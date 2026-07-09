import React from 'react';
import type { LeadFollowup } from '../../types';
import { FollowupCard } from './FollowupCard';

interface FollowupListProps {
  followups: LeadFollowup[];
}

export const FollowupList: React.FC<FollowupListProps> = ({ followups }) => {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
      {followups.map((followup) => (
        <FollowupCard key={followup.id} followup={followup} />
      ))}
    </div>
  );
};
export default FollowupList;
