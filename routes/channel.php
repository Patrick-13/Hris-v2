<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notifications', function ($user) {
    return $user != null; // allow authenticated users
});

Broadcast::channel('overtime.{employeeId}', function ($user, $employeeId) {
    // Only allow the authenticated user to listen to their own channel
    return $user->employee_id == $employeeId;
});
