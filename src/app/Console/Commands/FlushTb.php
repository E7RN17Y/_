<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Shadowserverrecord;

class FlushTb extends Command 
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flush:shadowrecordstable';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Shadowserverrecord::truncate();
    }
}
