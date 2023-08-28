<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

use App\Models\Type;

use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Auth;

class PersonalisationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::check() && Auth::user()->role === 'admin'){
            return Inertia::render('Dashboard/Personalisation/index', [
                'types'=>Type::all()
            ]);
        }else{
            return redirect('/dashboard')->withErrors([
                "authorization" => "Vous ne disposez pas des droits requis pour acceder a cette ressource."
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $attributes = $request->validate([
            "type"=> ['required', 'string','unique:types'],
            "category"=> ['required', 'string', 'in:scan,not-scan'],
        ]);

        $type = Type::insert([
            [
                'type' => $request->type,
                'category'=> $request->category,
            ]
        ]);

        Log::channel('db')->info("Le type $request->type a été crée avec succès.", ['username'=> Auth::user()->name]);

        return Inertia::render('Dashboard/Personalisation/index', array("types" => Type::all()));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return response()->json(Type::where('id',$id)->get(), 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $type = Type::where('id', $id);

        if(!$type){
            return redirect()->back()->withErrors(array('id'=>'id invalides'));
        }

        $request->validate([
            "type"=> ['required', 'string'],
            "category"=> ['required', 'string', 'in:scan,not-scan'],
        ]);

        $type->update($request->all());

        return Inertia::render('Dashboard/Personalisation/index', array("types" => Type::all()));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $type = Type::where('id', $id);

        if(!$type){
            return redirect()->back()->withErrors(array('id'=>'id invalides'));
        }

        Log::channel('db')->info("L'Utilisateur ".$type->get(['type'])[0]->type." a été supprimer avec succès.", ['username'=> Auth::user()->name]);

        $type->delete();


        return Inertia::render('Dashboard/Personalisation/index', array("types" => Type::all()));
    }

    public function all(){
        return Type::all();
    }
}
