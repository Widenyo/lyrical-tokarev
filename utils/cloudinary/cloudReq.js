const cloudinary = require('../../configs/cloudinary')

async function cloudReq(app){
    try{
      const gifsReq = await cloudinary.v2.search.expression( 'resource_type:image AND folder=gifs-epicos').sort_by('public_id','desc').max_results(500).execute()
      let gifs = gifsReq.resources
     
      if(gifsReq.next_cursor){
         let flag = true
         let pointer = gifsReq.next_cursor
         while(flag){
             const reqGifs = await cloudinary.v2.search.expression( 'resource_type:image AND folder=gifs-epicos').sort_by('public_id','desc').max_results(500).next_cursor(pointer).execute()
             gifs = [...gifs, ...reqGifs.resources]
             pointer = reqGifs.next_cursor
             if(!pointer) flag = false
         }
      }
      app.locals.gifs = gifs
      app.locals.indexBarGifs = gifs.filter(gif => {
        return gif.height <= 65 && gif.width <= 70;
      })
      console.log('gifs cargados')
     }catch(e){
       console.log(e)
       app.locals.gifs = []
       app.locals.indexBarGifs = []
     }
  }

  module.exports = cloudReq