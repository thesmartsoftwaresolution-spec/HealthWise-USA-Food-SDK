import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};
const reply = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const article = (r: any) => ({
  id:r.id,title:r.title,slug:r.slug,excerpt:r.excerpt,content:r.content,coverImageUrl:r.cover_image_url,
  categoryId:Number(r.category_id || 0),categoryName:r.category_name,tags:r.tags || [],authorName:r.author_name,
  medicalReviewer:r.medical_reviewer,metaTitle:r.meta_title,metaDescription:r.meta_description,
  readingTimeMin:r.reading_time_min,viewCount:r.view_count || 0,status:r.status,publishedAt:r.published_at || r.created_at,
  lastReviewedAt:r.last_reviewed_at,keyTakeaways:r.key_takeaways || [],references:r.references_json || [],
});
const recipe = (r: any) => ({
  id:r.id,title:r.title,slug:r.slug,description:r.description,coverImageUrl:r.cover_image_url,
  categoryId:Number(r.category_id || 0),categoryName:r.category_name,dietaryTags:r.dietary_tags || [],
  allergens:r.allergens || [],difficulty:r.difficulty || 'easy',prepTimeMin:r.prep_time_min || 0,
  cookTimeMin:r.cook_time_min || 0,totalTimeMin:r.total_time_min || 0,baseServings:r.servings || 1,
  costPerServing:Number(r.cost_per_serving || 0),calories:Number(r.calories || 0),proteinG:Number(r.protein_g || 0),
  carbsG:Number(r.carbs_g || 0),fatG:Number(r.fat_g || 0),fiberG:Number(r.fiber_g || 0),sodiumMg:Number(r.sodium_mg || 0),
  ingredients:r.ingredients || [],instructions:r.instructions || [],status:r.status,publishedAt:r.published_at || r.created_at,
  viewCount:r.view_count || 0,saveCount:r.save_count || 0,
});
const toArticle = (b: any) => ({
  title:b.title,slug:b.slug,excerpt:b.excerpt || '',content:b.content || '',cover_image_url:b.coverImageUrl || b.cover_image_url || '',
  category_id:b.categoryId || b.category_id || null,category_name:b.categoryName || b.category_name || null,tags:b.tags || [],
  author_name:b.authorName || b.author_name || 'HealthWise USA Editorial Team',medical_reviewer:b.medicalReviewer || null,
  meta_title:b.metaTitle || null,meta_description:b.metaDescription || null,reading_time_min:b.readingTimeMin || 5,
  status:b.status || 'draft',published_at:b.publishedAt || null,key_takeaways:b.keyTakeaways || [],references_json:b.references || [],
});
const toRecipe = (b: any) => ({
  title:b.title,slug:b.slug,description:b.description || '',cover_image_url:b.coverImageUrl || '',
  category_id:b.categoryId || null,category_name:b.categoryName || null,dietary_tags:b.dietaryTags || [],
  ingredients:b.ingredients || [],instructions:b.instructions || [],prep_time_min:b.prepTimeMin || 0,
  cook_time_min:b.cookTimeMin || 0,total_time_min:b.totalTimeMin || 0,servings:b.baseServings || 1,
  calories:b.calories || null,protein_g:b.proteinG || null,carbs_g:b.carbsG || null,fat_g:b.fatG || null,
  cost_per_serving:b.costPerServing || null,status:b.status || 'draft',published_at:b.publishedAt || null,
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = Deno.env.get('SUPABASE_URL') || '';
  const key = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || '';
  if (!url || !key) return reply({ success:false,error:'Supabase function environment is incomplete.' },500);
  const db = createClient(url,key,{global:{headers:{Authorization:request.headers.get('Authorization') || ''}},auth:{persistSession:false,autoRefreshToken:false}});
  const input = await request.json().catch(() => ({}));
  const path = new URL(String(input.path || '/api/'), 'https://internal.invalid').pathname;
  const query = new URL(String(input.path || '/api/'), 'https://internal.invalid').searchParams;
  const method = String(input.method || 'GET').toUpperCase();
  const body = input.payload && typeof input.payload === 'object' ? input.payload : {};
  const auth = await db.auth.getUser();
  const user = auth.data.user;
  const admin = async () => {
    if (!user) return false;
    const {data} = await db.from('profiles').select('role,status').eq('id',user.id).maybeSingle();
    return data?.role === 'admin' && data?.status === 'active';
  };
  const fail = (message:string,status=400) => reply({success:false,error:message},status);
  try {
    if (path === '/api/settings' && method === 'GET') {
      const {data,error} = await db.from('site_settings').select('*').eq('id',true).maybeSingle();
      if (error) throw error;
      return reply({success:true,settings:{...(data?.settings || {}),dailyTip:data?.daily_tip || 'Choose a variety of colorful whole foods each day.'}});
    }
    if (path === '/api/articles' && method === 'GET') {
      let q = db.from('articles').select('*').order('published_at',{ascending:false}).limit(500);
      if (!(await admin())) q = q.eq('status','published');
      const {data,error} = await q;
      if (error) throw error;
      let rows = (data || []).map(article);
      const cat = query.get('category'), search = (query.get('search') || '').toLowerCase();
      if (cat && cat !== 'all') rows = rows.filter((x:any) => String(x.categoryId) === cat || String(x.categoryName || '').toLowerCase().includes(cat.toLowerCase()));
      if (search) rows = rows.filter((x:any) => (x.title+' '+x.excerpt+' '+x.tags.join(' ')).toLowerCase().includes(search));
      const page = Math.max(1,Number(query.get('page') || 1)), limit = Math.min(100,Math.max(1,Number(query.get('limit') || 12)));
      return reply({success:true,data:rows.slice((page-1)*limit,page*limit),meta:{page,limit,total:rows.length,totalPages:Math.ceil(rows.length/limit)}});
    }
    const art = path.match(/^\/api\/articles\/([^/]+)$/);
    if (art && method === 'GET') {
      let {data,error} = await db.from('articles').select('*').eq('slug',decodeURIComponent(art[1])).maybeSingle();
      if (!data && !error) ({data,error} = await db.from('articles').select('*').eq('id',decodeURIComponent(art[1])).maybeSingle());
      if (error) throw error;
      if (!data) return fail('Article not found.',404);
      const {data:related} = await db.from('articles').select('*').eq('status','published').eq('category_id',data.category_id).neq('id',data.id).limit(3);
      return reply({success:true,data:{...article(data),relatedArticles:(related || []).map(article)}});
    }
    if (path === '/api/articles' && method === 'POST') {
      if (!(await admin())) return fail('Administrator access required.',403);
      const {data,error} = await db.from('articles').insert(toArticle(body)).select('*').single();
      if (error) throw error;
      return reply({success:true,data:article(data)});
    }
    if (art && (method === 'PUT' || method === 'DELETE')) {
      if (!(await admin())) return fail('Administrator access required.',403);
      const id = decodeURIComponent(art[1]);
      if (method === 'DELETE') { const {error}=await db.from('articles').delete().eq('id',id); if(error) throw error; return reply({success:true}); }
      const {data,error}=await db.from('articles').update(toArticle(body)).eq('id',id).select('*').single();
      if(error) throw error; return reply({success:true,data:article(data)});
    }
    if (path === '/api/recipes' && method === 'GET') {
      let q = db.from('recipes').select('*').order('published_at',{ascending:false}).limit(500);
      if (!(await admin())) q = q.eq('status','published');
      const {data,error}=await q; if(error) throw error;
      let rows=(data || []).map(recipe);
      const cat=query.get('category'),diet=query.get('dietary'),search=(query.get('search')||'').toLowerCase();
      const maxTime=Number(query.get('maxTime')||0),maxCost=Number(query.get('maxCost')||0);
      if(cat&&cat!=='all') rows=rows.filter((x:any)=>String(x.categoryId)===cat||String(x.categoryName||'').toLowerCase().includes(cat.toLowerCase()));
      if(diet&&diet!=='all') rows=rows.filter((x:any)=>x.dietaryTags.some((t:string)=>t.toLowerCase()===diet.toLowerCase()));
      if(maxTime) rows=rows.filter((x:any)=>x.totalTimeMin<=maxTime);
      if(maxCost) rows=rows.filter((x:any)=>x.costPerServing<=maxCost);
      if(search) rows=rows.filter((x:any)=>(x.title+' '+x.description+' '+JSON.stringify(x.ingredients)).toLowerCase().includes(search));
      const page=Math.max(1,Number(query.get('page')||1)),limit=Math.min(100,Math.max(1,Number(query.get('limit')||12)));
      return reply({success:true,data:rows.slice((page-1)*limit,page*limit),meta:{page,limit,total:rows.length,totalPages:Math.ceil(rows.length/limit)}});
    }
    const rec=path.match(/^\/api\/recipes\/([^/]+)$/);
    if(rec&&method==='GET'){
      let {data,error}=await db.from('recipes').select('*').eq('slug',decodeURIComponent(rec[1])).maybeSingle();
      if(!data&&!error) ({data,error}=await db.from('recipes').select('*').eq('id',decodeURIComponent(rec[1])).maybeSingle());
      if(error) throw error; if(!data) return fail('Recipe not found.',404);
      const [{data:related},{data:ratings}]=await Promise.all([
        db.from('recipes').select('*').eq('status','published').eq('category_id',data.category_id).neq('id',data.id).limit(3),
        db.from('recipe_ratings').select('*').eq('recipe_id',data.id).order('created_at',{ascending:false}),
      ]);
      const reviews=(ratings||[]).map((x:any)=>({id:x.id,recipeId:x.recipe_id,userId:x.user_id,userName:'Community Member',rating:x.rating,review:x.review,createdAt:x.created_at}));
      const average=reviews.length?Number((reviews.reduce((s:number,x:any)=>s+x.rating,0)/reviews.length).toFixed(1)):0;
      return reply({success:true,data:{...recipe(data),rating:average,ratingCount:reviews.length,reviews,relatedRecipes:(related||[]).map(recipe)}});
    }
    if (path === '/api/recipes' && method === 'POST') {
      if (!(await admin())) return fail('Administrator access required.',403);
      const {data,error}=await db.from('recipes').insert(toRecipe(body)).select('*').single();
      if(error) throw error; return reply({success:true,data:recipe(data)});
    }
    if(rec&&(method==='PUT'||method==='DELETE')){
      if(!(await admin())) return fail('Administrator access required.',403);
      const id=decodeURIComponent(rec[1]);
      if(method==='DELETE'){const {error}=await db.from('recipes').delete().eq('id',id);if(error)throw error;return reply({success:true});}
      const {data,error}=await db.from('recipes').update(toRecipe(body)).eq('id',id).select('*').single();
      if(error)throw error;return reply({success:true,data:recipe(data)});
    }
    if(path==='/api/recipes/'+decodeURIComponent(path.split('/')[3]||'')+'/ratings' && method==='GET'){
      const slug=decodeURIComponent(path.split('/')[3]||'');
      const {data:r}=await db.from('recipes').select('id').eq('slug',slug).maybeSingle();
      if(!r)return fail('Recipe not found.',404);
      const {data,error}=await db.from('recipe_ratings').select('*').eq('recipe_id',r.id).order('created_at',{ascending:false});
      if(error)throw error;
      const reviews=(data||[]).map((x:any)=>({id:x.id,recipeId:x.recipe_id,userId:x.user_id,userName:'Community Member',rating:x.rating,review:x.review,createdAt:x.created_at}));
      return reply({success:true,rating:reviews.length?Number((reviews.reduce((s:number,x:any)=>s+x.rating,0)/reviews.length).toFixed(1)):0,ratingCount:reviews.length,reviews});
    }
    if(path==='/api/search'&&method==='GET'){
      const term=(query.get('q')||'').toLowerCase().trim(); if(!term)return reply({success:true,data:{articles:[],recipes:[]}});
      const [{data:a},{data:r}]=await Promise.all([db.from('articles').select('*').eq('status','published').limit(500),db.from('recipes').select('*').eq('status','published').limit(500)]);
      const type=query.get('type')||'all';
      return reply({success:true,data:{articles:type==='recipes'?[]:(a||[]).filter((x:any)=>(x.title+' '+x.excerpt+' '+(x.tags||[]).join(' ')).toLowerCase().includes(term)).slice(0,10).map(article),recipes:type==='articles'?[]:(r||[]).filter((x:any)=>(x.title+' '+x.description+' '+JSON.stringify(x.ingredients)).toLowerCase().includes(term)).slice(0,10).map(recipe),query:term}});
    }
    if(path==='/api/users/me/saved'&&method==='GET'){
      if(!user)return fail('Sign in to access saved items.',401);
      const {data,error}=await db.from('saved_items').select('*').eq('user_id',user.id).order('created_at',{ascending:false});if(error)throw error;
      const ai=(data||[]).filter((x:any)=>x.item_type==='article').map((x:any)=>x.item_id),ri=(data||[]).filter((x:any)=>x.item_type==='recipe').map((x:any)=>x.item_id);
      const [{data:a},{data:r}]=await Promise.all([ai.length?db.from('articles').select('*').in('id',ai):Promise.resolve({data:[]}),ri.length?db.from('recipes').select('*').in('id',ri):Promise.resolve({data:[]})]);
      return reply({success:true,articles:(a||[]).map(article),recipes:(r||[]).map(recipe)});
    }
    if(path==='/api/users/me/saved'&&method==='POST'){
      if(!user)return fail('Sign in to save items.',401);
      if(!['article','recipe'].includes(String(body.itemType))||!body.itemId)return fail('Invalid saved item.');
      const {error}=await db.from('saved_items').upsert({user_id:user.id,item_type:body.itemType,item_id:String(body.itemId)},{onConflict:'user_id,item_type,item_id'});if(error)throw error;return reply({success:true});
    }
    const saved=path.match(/^\/api\/users\/me\/saved\/(article|recipe)\/([^/]+)$/);
    if(saved&&method==='DELETE'){if(!user)return fail('Sign in required.',401);const {error}=await db.from('saved_items').delete().eq('user_id',user.id).eq('item_type',saved[1]).eq('item_id',decodeURIComponent(saved[2]));if(error)throw error;return reply({success:true});}
    if(path==='/api/users/me/plans'&&method==='GET'){
      if(!user)return fail('Sign in required.',401);const {data,error}=await db.from('meal_plans').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(10);if(error)throw error;
      return reply({success:true,plans:(data||[]).map((p:any)=>({id:p.id,userId:p.user_id,title:p.title,weekOf:p.week_of,dietaryPrefs:p.dietary_prefs,allergies:p.allergies,calorieGoal:p.calorie_goal,weeklyBudget:p.weekly_budget,servings:p.servings,planData:p.plan_data,status:p.status,createdAt:p.created_at}))});
    }
    if(path==='/api/users/me/grocery'&&method==='GET'){
      if(!user)return fail('Sign in required.',401);const {data,error}=await db.from('grocery_lists').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(10);if(error)throw error;
      return reply({success:true,lists:(data||[]).map((g:any)=>({id:g.id,userId:g.user_id,mealPlanId:g.meal_plan_id,title:g.title,categories:g.categories,estimatedTotal:g.estimated_total,createdAt:g.created_at}))});
    }
    if(path==='/api/users/me/habits'&&method==='GET'){
      if(!user)return fail('Sign in required.',401);
      const [{data:h,error:he},{data:l,error:le}]=await Promise.all([db.from('habits').select('*').eq('user_id',user.id).eq('is_active',true),db.from('habit_logs').select('*').eq('user_id',user.id).order('logged_date',{ascending:false}).limit(500)]);
      if(he)throw he;if(le)throw le;return reply({success:true,habits:(h||[]).map((x:any)=>({id:x.id,userId:x.user_id,name:x.name,category:x.category,icon:x.icon||'',targetPerDay:x.target_per_day,unit:x.unit,isActive:x.is_active,streakCount:0})),logs:(l||[]).map((x:any)=>({id:x.id,habitId:x.habit_id,userId:x.user_id,loggedDate:x.logged_date,completed:x.completed}))});
    }
    const habit=path.match(/^\/api\/users\/me\/habits\/([^/]+)\/toggle$/);
    if(habit&&method==='POST'){
      if(!user)return fail('Sign in required.',401);const id=Number(habit[1]),date=String(body.date||new Date().toISOString().slice(0,10));
      const {data:existing}=await db.from('habit_logs').select('id').eq('habit_id',id).eq('user_id',user.id).eq('logged_date',date).maybeSingle();
      const result=existing?await db.from('habit_logs').delete().eq('id',existing.id).eq('user_id',user.id):await db.from('habit_logs').insert({habit_id:id,user_id:user.id,logged_date:date,completed:true});
      if(result.error)throw result.error;return reply({success:true});
    }
    if(path==='/api/newsletter'&&method==='POST'){
      const email=String(body.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return fail('Enter a valid email address.');
      const {error}=await db.from('newsletter_subscribers').upsert({email,name:body.name||null,source:body.source||'website'},{onConflict:'email',ignoreDuplicates:true});if(error)throw error;return reply({success:true,message:'You are subscribed.'});
    }
    if(path==='/api/contact'&&method==='POST'){
      const values={name:String(body.name||'').trim().slice(0,120),email:String(body.email||'').trim().slice(0,254),subject:String(body.subject||'').trim().slice(0,200),message:String(body.message||'').trim().slice(0,10000)};
      if(!values.name||!values.email.includes('@')||!values.subject||!values.message)return fail('Complete all required fields.');
      const {error}=await db.from('contact_messages').insert(values);if(error)throw error;return reply({success:true,message:'Message sent.'});
    }
    if(path==='/api/settings'&&method==='PUT'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const {error}=await db.from('site_settings').upsert({id:true,daily_tip:body.dailyTip||'',settings:body});
      if(error)throw error;return reply({success:true,settings:body});
    }
    if(path==='/api/admin/stats'&&method==='GET'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const [u,a,r,n,m]=await Promise.all([
        db.from('profiles').select('id',{count:'exact',head:true}),
        db.from('articles').select('id',{count:'exact',head:true}),
        db.from('recipes').select('id',{count:'exact',head:true}),
        db.from('newsletter_subscribers').select('id',{count:'exact',head:true}),
        db.from('contact_messages').select('id',{count:'exact',head:true})
      ]);
      return reply({success:true,stats:{users:u.count||0,articles:a.count||0,recipes:r.count||0,subscribers:n.count||0,contactMessages:m.count||0}});
    }
    if(path==='/api/admin/users'&&method==='GET'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const {data,error}=await db.from('profiles').select('id,email,name,role,status,created_at,last_login_at,dietary_prefs').order('created_at',{ascending:false}).limit(500);
      if(error)throw error;
      return reply({success:true,users:(data||[]).map((p:any)=>({id:p.id,email:p.email,name:p.name,role:p.role,status:p.status,createdAt:p.created_at,lastLoginAt:p.last_login_at,dietaryPrefs:p.dietary_prefs}))});
    }
    if(path==='/api/admin/newsletter'&&method==='GET'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const {data,error}=await db.from('newsletter_subscribers').select('*').order('subscribed_at',{ascending:false}).limit(1000);
      if(error)throw error;return reply({success:true,subscribers:data||[]});
    }
    if(path==='/api/admin/contact'&&method==='GET'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const {data,error}=await db.from('contact_messages').select('*').order('created_at',{ascending:false}).limit(500);
      if(error)throw error;return reply({success:true,messages:data||[]});
    }
    const contactStatus=path.match(/^\/api\/admin\/contact\/([^/]+)\/status$/);
    if(contactStatus&&method==='PUT'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const {error}=await db.from('contact_messages').update({status:body.status}).eq('id',decodeURIComponent(contactStatus[1]));
      if(error)throw error;return reply({success:true});
    }
    const roleChange=path.match(/^\/api\/admin\/users\/([^/]+)\/role$/);
    if(roleChange&&method==='PUT'){
      if(!(await admin()))return fail('Administrator access required.',403);
      const {error}=await db.rpc('admin_update_profile_role',{target_user_id:decodeURIComponent(roleChange[1]),new_role:body.role});
      if(error)throw error;return reply({success:true});
    }
    const ratingPath=path.match(/^\/api\/recipes\/([^/]+)\/ratings$/);
    if(ratingPath&&method==='POST'){
      if(!user)return fail('Sign in to rate a recipe.',401);
      const {data:recRow}=await db.from('recipes').select('id').eq('slug',decodeURIComponent(ratingPath[1])).maybeSingle();
      if(!recRow)return fail('Recipe not found.',404);
      const rating=Number(body.rating);
      if(!Number.isInteger(rating)||rating<1||rating>5)return fail('Rating must be between 1 and 5.');
      const {data,error}=await db.from('recipe_ratings').upsert({recipe_id:recRow.id,user_id:user.id,rating,review:String(body.review||'').slice(0,2000)},{onConflict:'recipe_id,user_id'}).select('*').single();
      if(error)throw error;
      return reply({success:true,newRating:{id:data.id,recipeId:data.recipe_id,userId:data.user_id,userName:user.email||'Member',rating:data.rating,review:data.review,createdAt:data.created_at}});
    }
    if(path.startsWith('/api/ai/')){
      if(!user)return fail('Sign in to use AI tools.',401);
      const apiKey=Deno.env.get('GEMINI_API_KEY');
      if(!apiKey)return fail('AI is not configured. Add GEMINI_API_KEY to Supabase Edge Function secrets.',503);
      const prompts:any={
        '/api/ai/chat':String(body.message||''),
        '/api/ai/meal-plan':'Create a practical seven-day meal plan. Return JSON with title, days (each has day, meals with breakfast/lunch/dinner/snack, totalCalories), weeklyAvgCalories, estimatedWeeklyCost. Respect preferences and allergies. Input: '+JSON.stringify(body),
        '/api/ai/recipe':'Create a practical healthy recipe as JSON with title, description, ingredients, instructions, servings, prepTimeMin, cookTimeMin, calories, proteinG, carbsG, fatG. Respect allergies. Input: '+JSON.stringify(body),
        '/api/ai/nutrition':'Give a cautious nutrition estimate and explain uncertainty for this food. Input: '+JSON.stringify(body),
        '/api/ai/grocery':'Create a categorized grocery list as JSON with categories produce, dairy, proteins, pantry, frozen and estimatedTotal. Input: '+JSON.stringify(body)
      };
      if(!prompts[path])return fail('Unknown AI tool.',404);
      const isChat=path==='/api/ai/chat'||path==='/api/ai/nutrition';
      const promptText='You are HealthWise USA, an evidence-informed general wellness and nutrition assistant. Do not diagnose, prescribe, or replace a clinician. Respect stated allergies. For health questions, state uncertainty and advise professional care when appropriate. '+prompts[path];
      const aiResponse=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+encodeURIComponent(apiKey),{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({contents:[{role:'user',parts:[{text:promptText}]}],generationConfig:isChat?{}:{responseMimeType:'application/json'}})
      });
      if(!aiResponse.ok){console.error('Gemini API status',aiResponse.status);return fail('AI provider request failed. Check GEMINI_API_KEY and provider access.',502);}
      const aiJson=await aiResponse.json();
      const output=(aiJson.candidates?.[0]?.content?.parts||[]).map((p:any)=>p.text||'').join('');
      if(path==='/api/ai/chat')return reply({success:true,reply:output,relatedArticles:[],remainingRequests:10});
      let parsed:any;try{parsed=JSON.parse(output)}catch{parsed={text:output}}
      if(path==='/api/ai/meal-plan'){
        const plan={id:crypto.randomUUID(),userId:user.id,title:parsed.title||'Your personalized meal plan',weekOf:new Date().toISOString().slice(0,10),dietaryPrefs:body.dietaryPrefs||[],allergies:body.allergies||[],calorieGoal:body.calorieGoal,weeklyBudget:body.weeklyBudget,servings:body.servings||1,planData:parsed,status:'active',createdAt:new Date().toISOString()};
        const {error}=await db.from('meal_plans').insert({id:plan.id,user_id:user.id,title:plan.title,week_of:plan.weekOf,dietary_prefs:plan.dietaryPrefs,allergies:plan.allergies,calorie_goal:plan.calorieGoal,weekly_budget:plan.weeklyBudget,servings:plan.servings,plan_data:plan.planData,status:'active'});
        if(error)throw error;return reply({success:true,plan});
      }
      if(path==='/api/ai/grocery')return reply({success:true,list:parsed});
      return reply({success:true,data:parsed});
    }
    return fail('API route not implemented.',404);
  } catch(error) {
    console.error('Supabase API request failed:',error);
    return fail('Request failed. Check the Supabase schema, Data API exposure, and Edge Function logs.',500);
  }
});
