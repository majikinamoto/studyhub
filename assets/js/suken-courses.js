export const sukenCourses=[
 {id:'roots',title:'√の基礎〜有理化',phase:'first',page:'suken-roots.html',prerequisites:[]},
 {id:'algebra',title:'展開・因数分解',phase:'first',page:'suken-algebra.html',prerequisites:[]},
 {id:'numbers',title:'数の整理と集合',phase:'first',prerequisites:['roots','algebra']},
 {id:'equations',title:'方程式と複素数',phase:'first',prerequisites:['roots','algebra']},
 {id:'geometry',title:'座標と関数・円',phase:'first',prerequisites:['equations']},
 {id:'trigonometry',title:'三角比と三角関数',phase:'first',prerequisites:['roots','geometry']},
 {id:'powers',title:'指数と対数',phase:'first',prerequisites:['roots','algebra']},
 {id:'calculus',title:'微分と積分',phase:'first',prerequisites:['geometry','algebra']},
 {id:'sequences',title:'数列と和',phase:'first',prerequisites:['algebra','powers']},
 {id:'vectors',title:'ベクトルの計算と図形',phase:'first',prerequisites:['geometry','trigonometry']},
 {id:'probability',title:'場合の数・確率・期待値',phase:'first',prerequisites:['numbers']},
 {id:'reasoning',title:'証明・軌跡・規則性の入口',phase:'second',prerequisites:['algebra','numbers','geometry','sequences']}
];
export const courseHref=c=>'./'+(c.page||'suken-course.html?topic='+c.id);
