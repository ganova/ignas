<?php

namespace Database\Factories;

use App\Models\Portfolio;
use Illuminate\Database\Eloquent\Factories\Factory;

class PortfolioFactory extends Factory
{
    protected $model = Portfolio::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(3);

        return [
            'title' => $title,
            'slug' => Portfolio::generateUniqueSlug($title),
            'platform' => $this->faker->randomElement(array_keys(Portfolio::PLATFORMS)),
            'category' => $this->faker->word(),
            'duration' => '00:'.$this->faker->numberBetween(10, 59),
            'views_label' => $this->faker->numberBetween(1, 999).' rb',
            'description' => $this->faker->sentence(),
            'gradient_from' => '#B9A9FF',
            'gradient_to' => '#8FC2FF',
            'is_featured' => false,
            'is_published' => false,
            'published_at' => null,
            'sort_order' => 0,
        ];
    }
}
