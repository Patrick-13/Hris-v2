<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_100_users_can_login(): void
    {
        $users = User::factory()->count(100)->create();

        foreach ($users as $user) {
            // Give each user a known password
            $user->update([
                'password' => Hash::make('pass1234!'),
            ]);

            $response = $this->post('/login', [
                'name' => $user->name,
                'password' => 'pass1234!',
            ]);

            $response->assertRedirect('/user/userdashboard');

            $this->assertAuthenticatedAs($user);

            // Logout before testing the next user
            auth()->logout();
        }
    }
}
