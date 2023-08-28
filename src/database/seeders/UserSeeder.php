<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(){
        
        \App\Models\User::firstOrCreate(
            ['name' => 'admin admin','email' => 'admin@gmail.com'],
            [
                'name' => 'admin admin',
                'email' => 'admin@gmail.com',
                'role' => 'admin',
                'password' => Hash::make('Test@1234')
            ]
        );
    }
}
