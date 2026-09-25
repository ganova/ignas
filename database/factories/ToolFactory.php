<?php

namespace Database\Factories;

use App\Models\Tool;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tool>
 */
class ToolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut']),
            'category' => 'Editing',
            'is_published' => true,
            'sort_order' => 0,
        ];
    }
}
