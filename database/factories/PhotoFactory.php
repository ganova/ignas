<?php

namespace Database\Factories;

use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Photo>
 */
class PhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'image' => 'photo-gallery/example.jpg',
            'alt_text' => fake()->sentence(),
            'caption' => fake()->sentence(),
            'is_published' => true,
            'sort_order' => 0,
        ];
    }
}
