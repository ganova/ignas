<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
    $this->actingAs(User::factory()->create());
});

it('accepts a valid image upload', function () {
    $file = UploadedFile::fake()->image('thumb.jpg', 800, 600);

    $this->post('/admin/media', ['file' => $file])->assertRedirect();

    $this->assertDatabaseHas('media', ['original_name' => 'thumb.jpg']);
});

it('rejects an svg upload', function () {
    $file = UploadedFile::fake()->createWithContent('malicious.svg', '<svg onload="alert(1)"></svg>');

    $this->post('/admin/media', ['file' => $file])->assertSessionHasErrors('file');
});

it('rejects a php file disguised as an image', function () {
    $file = UploadedFile::fake()->createWithContent('shell.php', '<?php echo "hi"; ?>');

    $this->post('/admin/media', ['file' => $file])->assertSessionHasErrors('file');
});

it('rejects an oversized file', function () {
    $file = UploadedFile::fake()->image('big.jpg')->size(20000);

    $this->post('/admin/media', ['file' => $file])->assertSessionHasErrors('file');
});
