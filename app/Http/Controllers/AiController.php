<?php

namespace App\Http\Controllers;

use App\Services\AiService;
use Illuminate\Http\Request;


class AiController extends Controller
{
    public function ask(Request $request, AiService $ai)
    {
        $request->validate([
            'message' => ['required', 'string'],
        ]);

        $answer = $ai->ask($request->message);

        return response()->json([
            'answer' => $answer,
        ]);
    }
}
