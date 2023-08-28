<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{ShadowServerController, SearchController};
use App\Http\Middleware\AuthenticateApi;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::post('shadow-server', [ShadowServerController::class, 'index']);
Route::post('/get-ip-blocklist-infos', [SearchController::class, 'get_ip_blocklist_infos']);

// Route::post('/shadow-server-records', [ShadowServerController::class, 'records']);
// Route::post('/stats/shadow-server-records', [ShadowServerController::class, 'stats']);
// Route::post('/stats/specific-category/shadow-server-records', [ShadowServerController::class, 'single_stats']);