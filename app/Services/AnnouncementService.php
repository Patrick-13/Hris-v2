<?php

namespace App\Services;

use App\DTOs\AnnouncementData;
use App\Models\Announcement;

class AnnouncementService
{
    public function createAnnouncement(AnnouncementData $data): Announcement
    {
        return Announcement::create([
            'title' => $data->title,
            'body' => $data->body,
            'date_of_announcement' => $data->date_of_announcement,
        ]);
    }

    public function updateAnnouncement(AnnouncementData $data, int $id): Announcement
    {
        $announcement = Announcement::findOrFail($id);

        $announcement->update([
            'title' => $data->title,
            'body' => $data->body,
            'date_of_announcement' => $data->date_of_announcement,
        ]);

        return $announcement;
    }
}
