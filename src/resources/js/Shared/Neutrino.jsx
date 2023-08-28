import React from 'react'


const NeutrinoAPI = ({data})=>{

    switch(data.children.length){
        case 1:
            return (
                <div>
                    {data.name}: {data.children[0].name.toString()}
                </div>
            )
            break
        default:
            return (
                <div className=''>
                  <div>{data.name} </div>
                  <div>
                    {
                        data.children.length ? data.children.map(_=>{
                            
                            if(_.children && _.children.length > 0){
                                
                                return _.children.map($=>{
                                    return (
                                        <div className='ml-2'>
                                           <div>{_.name}: {$.name.toString()}</div> 
                                        </div>
                                    )
                                })
                            
 
                            }else{
                                return (
                                    <div className='ml-2'>
                                      {_.name.toString()}
                                    </div>
                                )
                            }
                        }): 'aucun resultat'
                    }
                  </div>
                </div>
            )
    }
}

export default NeutrinoAPI;