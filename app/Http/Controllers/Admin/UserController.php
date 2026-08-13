<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function edit($id)
    {
        return User::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $data, $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'role' => $data->role,
        ]);

        return redirect()->route('usermodule.index')->with([
            'success' => 'User Updated Successfully!',
        ]);
    }
}
