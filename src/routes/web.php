<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{LoginController, LogsController,ShadowServerController,UsersController,PersonalisationController,SearchController};
use Inertia\Inertia; // We are going to use this class to render React components

Route::get('/', LoginController::class)->name('login');

Route::post('/login', [LoginController::class, 'store']);

Route::middleware('auth')->group(function(){

    Route::group(['prefix'=>'dashboard'],function(){
        
        Route::get('/', function(){
            return Inertia::render('Dashboard/index');
        });

        Route::resource('/personalisation', PersonalisationController::class);
    
        Route::resource('/utilisateurs', UsersController::class);
        
        Route::get('/rechercher', function(){
            return Inertia::render('Dashboard/Rechercher/index');
        })->name('search');
    });



    Route::post('/logout', [LoginController::class, 'logout']);

    Route::get('/dashboard/logs',LogsController::class);

    

    Route::get('/personalisation/all-types', [PersonalisationController::class,'all']);
});

Route::post('/get-ip-blocklist-infos', [SearchController::class, 'get_ip_blocklist_infos']);
Route::post('shadow-server', [ShadowServerController::class, 'index']);
Route::get('last-records-date', [ShadowServerController::class, 'last_records_date']);
Route::post('/shadow-server-records', [ShadowServerController::class, 'records']);
Route::post('/stats/shadow-server-records', [ShadowServerController::class, 'stats']);
Route::post('/stats/specific-category/shadow-server-records', [ShadowServerController::class, 'single_stats']);



