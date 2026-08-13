<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class OpenAiService
{
    public function ask(string $prompt): string
    {
        try {

            $response = OpenAI::responses()->create([
                'model' => 'gpt-4.1-mini',
                'input' => $prompt,
            ]);

            return $response->output[0]->content[0]->text;
        } catch (\Throwable $e) {

            return "AI Error: " . $e->getMessage();
        }
    }
}
