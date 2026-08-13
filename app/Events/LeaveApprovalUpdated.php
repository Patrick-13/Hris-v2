<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeaveApprovalUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $pendingCount;

    /**
     * Create a new event instance.
     */
    public function __construct($pendingCount)
    {
        $this->pendingCount = $pendingCount;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('notifications');
    }
    public function broadcastAs()
    {
        return 'leave-approval.updated';
    }

    public function broadcastWith()
    {
        return [
            'pendingCount' => $this->pendingCount,
        ];
    }
}
