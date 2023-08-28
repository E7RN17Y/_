<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LogMessages;

class LogsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        
        $logs = LogMessages::query()->get(['context', 'logged_at', 'message', 'level_name', 'id']);

        // dd($logs);

        return Inertia::render('Dashboard/Logs',[
            'logs'=>$logs
        ]);
    }
}
