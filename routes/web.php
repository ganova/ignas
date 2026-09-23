<?php

use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\ProcessStepController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SeoAssetsController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

Route::get('/robots.txt', [SeoAssetsController::class, 'robots'])->name('seo.robots');
Route::get('/sitemap.xml', [SeoAssetsController::class, 'sitemap'])->name('seo.sitemap');

Route::middleware(['auth', 'verified', 'auth.session'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::resource('portfolio', PortfolioController::class)->except(['show']);
    Route::post('portfolio/reorder', [PortfolioController::class, 'reorder'])->name('portfolio.reorder');
    Route::patch('portfolio/{portfolio}/toggle-publish', [PortfolioController::class, 'togglePublish'])->name('portfolio.toggle-publish');
    Route::patch('portfolio/{portfolio}/toggle-featured', [PortfolioController::class, 'toggleFeatured'])->name('portfolio.toggle-featured');

    Route::get('services', [ServiceController::class, 'index'])->name('services.index');
    Route::post('services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
    Route::post('services/reorder', [ServiceController::class, 'reorder'])->name('services.reorder');

    Route::get('process', [ProcessStepController::class, 'index'])->name('process.index');
    Route::post('process', [ProcessStepController::class, 'store'])->name('process.store');
    Route::put('process/{process_step}', [ProcessStepController::class, 'update'])->name('process.update');
    Route::delete('process/{process_step}', [ProcessStepController::class, 'destroy'])->name('process.destroy');
    Route::post('process/reorder', [ProcessStepController::class, 'reorder'])->name('process.reorder');

    Route::get('faqs', [FaqController::class, 'index'])->name('faqs.index');
    Route::post('faqs', [FaqController::class, 'store'])->name('faqs.store');
    Route::put('faqs/{faq}', [FaqController::class, 'update'])->name('faqs.update');
    Route::delete('faqs/{faq}', [FaqController::class, 'destroy'])->name('faqs.destroy');
    Route::post('faqs/reorder', [FaqController::class, 'reorder'])->name('faqs.reorder');

    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::post('media', [MediaController::class, 'store'])->name('media.store');
    Route::put('media/{media}', [MediaController::class, 'update'])->name('media.update');
    Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('seo', [SeoController::class, 'edit'])->name('seo.edit');
    Route::put('seo', [SeoController::class, 'update'])->name('seo.update');

    Route::get('messages', [ContactMessageController::class, 'index'])->name('messages.index');
    Route::patch('messages/{contactMessage}/read', [ContactMessageController::class, 'markRead'])->name('messages.read');
    Route::delete('messages/{contactMessage}', [ContactMessageController::class, 'destroy'])->name('messages.destroy');
});

require __DIR__.'/auth.php';
