-- Insert 50+ sample contents with diverse topics
INSERT INTO public.contents (title, description, type, difficulty, duration, rating, subject, tags) VALUES
  -- Inteligência Artificial (10 items)
  ('Introdução à Inteligência Artificial', 'Conceitos fundamentais de IA, história e aplicações práticas no mundo moderno.', 'video', 'iniciante', '45min', 4.8, 'Inteligência Artificial', ARRAY['IA', 'fundamentos', 'iniciante']),
  ('Redes Neurais Artificiais', 'Compreenda o funcionamento de redes neurais e sua aplicação em problemas reais.', 'article', 'intermediário', '1h 30min', 4.7, 'Inteligência Artificial', ARRAY['IA', 'neural networks', 'deep learning']),
  ('Processamento de Linguagem Natural', 'Aprenda técnicas de NLP para análise e geração de texto.', 'video', 'avançado', '2h 15min', 4.9, 'Inteligência Artificial', ARRAY['NLP', 'IA', 'text processing']),
  ('Computer Vision Fundamentals', 'Introdução ao processamento de imagens e visão computacional.', 'pdf', 'intermediário', '3h', 4.6, 'Inteligência Artificial', ARRAY['computer vision', 'image processing', 'IA']),
  ('IA Ética e Responsável', 'Discussões sobre ética, viés e responsabilidade no desenvolvimento de IA.', 'article', 'iniciante', '40min', 4.5, 'Inteligência Artificial', ARRAY['ética', 'IA', 'sociedade']),
  ('Algoritmos Genéticos', 'Otimização usando algoritmos inspirados na evolução biológica.', 'video', 'avançado', '1h 45min', 4.8, 'Inteligência Artificial', ARRAY['algoritmos', 'otimização', 'IA']),
  ('Quiz: Fundamentos de IA', 'Teste seus conhecimentos sobre os conceitos básicos de Inteligência Artificial.', 'quiz', 'iniciante', '15min', 4.7, 'Inteligência Artificial', ARRAY['quiz', 'IA', 'avaliação']),
  ('Transfer Learning na Prática', 'Aprenda a reutilizar modelos pré-treinados para suas aplicações.', 'video', 'intermediário', '1h 20min', 4.8, 'Inteligência Artificial', ARRAY['transfer learning', 'deep learning', 'IA']),
  ('Reinforcement Learning Básico', 'Introdução ao aprendizado por reforço e suas aplicações.', 'article', 'avançado', '2h', 4.9, 'Inteligência Artificial', ARRAY['reinforcement learning', 'IA', 'games']),
  ('IA Generativa com GANs', 'Crie imagens, música e arte usando Redes Adversariais Generativas.', 'pdf', 'avançado', '2h 30min', 4.9, 'Inteligência Artificial', ARRAY['GANs', 'generative AI', 'criatividade']),

  -- Machine Learning (10 items)
  ('Machine Learning: Primeiros Passos', 'Introdução ao ML com exemplos práticos e casos de uso.', 'video', 'iniciante', '50min', 4.6, 'Machine Learning', ARRAY['ML', 'iniciante', 'fundamentos']),
  ('Algoritmos de Classificação', 'Aprenda SVM, Decision Trees, Random Forest e mais.', 'article', 'intermediário', '2h', 4.7, 'Machine Learning', ARRAY['classificação', 'algoritmos', 'ML']),
  ('Regressão Linear e Logística', 'Fundamentos matemáticos e implementação prática de regressões.', 'video', 'iniciante', '1h 15min', 4.5, 'Machine Learning', ARRAY['regressão', 'estatística', 'ML']),
  ('Clustering e Segmentação', 'Técnicas de agrupamento: K-Means, DBSCAN, Hierarchical.', 'pdf', 'intermediário', '1h 40min', 4.8, 'Machine Learning', ARRAY['clustering', 'unsupervised', 'ML']),
  ('Feature Engineering Avançado', 'Técnicas para criar e selecionar features relevantes.', 'article', 'avançado', '2h 10min', 4.9, 'Machine Learning', ARRAY['feature engineering', 'preprocessing', 'ML']),
  ('Ensemble Methods', 'Combine múltiplos modelos para melhor performance: Bagging, Boosting, Stacking.', 'video', 'avançado', '1h 50min', 4.8, 'Machine Learning', ARRAY['ensemble', 'boosting', 'ML']),
  ('Quiz: Algoritmos de ML', 'Avalie seu conhecimento sobre os principais algoritmos de Machine Learning.', 'quiz', 'intermediário', '20min', 4.6, 'Machine Learning', ARRAY['quiz', 'ML', 'algoritmos']),
  ('Validação Cruzada e Métricas', 'Aprenda a avaliar modelos corretamente usando cross-validation.', 'article', 'iniciante', '45min', 4.7, 'Machine Learning', ARRAY['validação', 'métricas', 'ML']),
  ('Overfitting e Regularização', 'Entenda e previna overfitting com técnicas de regularização.', 'video', 'intermediário', '1h 10min', 4.8, 'Machine Learning', ARRAY['regularização', 'overfitting', 'ML']),
  ('AutoML e Hyperparameter Tuning', 'Otimize seus modelos automaticamente com AutoML.', 'pdf', 'avançado', '2h 20min', 4.9, 'Machine Learning', ARRAY['AutoML', 'otimização', 'ML']),

  -- Programação Python (10 items)
  ('Python para Iniciantes', 'Aprenda Python do zero: sintaxe, variáveis, loops e funções.', 'video', 'iniciante', '2h', 4.8, 'Programação', ARRAY['Python', 'iniciante', 'programação']),
  ('Estruturas de Dados em Python', 'Listas, tuplas, dicionários, sets e suas operações.', 'article', 'iniciante', '1h 30min', 4.7, 'Programação', ARRAY['Python', 'estruturas de dados', 'básico']),
  ('Programação Orientada a Objetos', 'Classes, herança, polimorfismo e encapsulamento em Python.', 'video', 'intermediário', '2h 30min', 4.9, 'Programação', ARRAY['POO', 'Python', 'orientação a objetos']),
  ('Pandas para Análise de Dados', 'Manipule e analise dados eficientemente com Pandas.', 'pdf', 'intermediário', '3h', 4.8, 'Programação', ARRAY['Pandas', 'análise de dados', 'Python']),
  ('NumPy e Computação Científica', 'Arrays, operações vetoriais e álgebra linear com NumPy.', 'article', 'intermediário', '1h 45min', 4.7, 'Programação', ARRAY['NumPy', 'computação científica', 'Python']),
  ('Python Assíncrono com AsyncIO', 'Programação assíncrona para aplicações de alta performance.', 'video', 'avançado', '2h 10min', 4.9, 'Programação', ARRAY['async', 'concorrência', 'Python']),
  ('Quiz: Python Fundamentals', 'Teste seus conhecimentos básicos e intermediários de Python.', 'quiz', 'iniciante', '15min', 4.6, 'Programação', ARRAY['quiz', 'Python', 'avaliação']),
  ('Decorators e Context Managers', 'Conceitos avançados de Python para código mais elegante.', 'article', 'avançado', '1h 20min', 4.8, 'Programação', ARRAY['decorators', 'avançado', 'Python']),
  ('Testing com Pytest', 'Escreva testes eficazes para seu código Python.', 'video', 'intermediário', '1h 30min', 4.7, 'Programação', ARRAY['testing', 'pytest', 'Python']),
  ('FastAPI: APIs Modernas', 'Crie APIs RESTful rápidas e robustas com FastAPI.', 'pdf', 'avançado', '2h 40min', 4.9, 'Programação', ARRAY['FastAPI', 'API', 'web']),

  -- Desenvolvimento Web (10 items)
  ('HTML5 e CSS3 Essenciais', 'Fundamentos de desenvolvimento web: estrutura e estilização.', 'video', 'iniciante', '2h 30min', 4.7, 'Desenvolvimento Web', ARRAY['HTML', 'CSS', 'web']),
  ('JavaScript Moderno (ES6+)', 'Arrow functions, destructuring, promises e async/await.', 'article', 'intermediário', '2h 15min', 4.8, 'Desenvolvimento Web', ARRAY['JavaScript', 'ES6', 'frontend']),
  ('React: Componentes e Hooks', 'Domine React com componentes funcionais e hooks.', 'video', 'intermediário', '3h 20min', 4.9, 'Desenvolvimento Web', ARRAY['React', 'hooks', 'frontend']),
  ('Node.js e Express', 'Construa backends escaláveis com Node.js e Express.', 'pdf', 'intermediário', '2h 50min', 4.8, 'Desenvolvimento Web', ARRAY['Node.js', 'Express', 'backend']),
  ('TypeScript para JavaScript', 'Adicione tipagem estática ao seu código JavaScript.', 'article', 'iniciante', '1h 40min', 4.7, 'Desenvolvimento Web', ARRAY['TypeScript', 'JavaScript', 'tipos']),
  ('Next.js: SSR e SSG', 'Server-Side Rendering e Static Site Generation com Next.js.', 'video', 'avançado', '3h', 4.9, 'Desenvolvimento Web', ARRAY['Next.js', 'SSR', 'React']),
  ('Quiz: Desenvolvimento Web', 'Avalie seus conhecimentos sobre desenvolvimento web moderno.', 'quiz', 'intermediário', '20min', 4.6, 'Desenvolvimento Web', ARRAY['quiz', 'web', 'avaliação']),
  ('CSS Grid e Flexbox', 'Layouts modernos e responsivos com Grid e Flexbox.', 'article', 'iniciante', '1h 30min', 4.8, 'Desenvolvimento Web', ARRAY['CSS', 'layout', 'responsivo']),
  ('Web Performance Optimization', 'Técnicas para otimizar o desempenho de aplicações web.', 'video', 'avançado', '2h 20min', 4.9, 'Desenvolvimento Web', ARRAY['performance', 'otimização', 'web']),
  ('GraphQL: API do Futuro', 'Aprenda GraphQL para APIs mais eficientes e flexíveis.', 'pdf', 'avançado', '2h 30min', 4.8, 'Desenvolvimento Web', ARRAY['GraphQL', 'API', 'backend']),

  -- Banco de Dados (10 items)
  ('SQL Básico para Iniciantes', 'SELECT, INSERT, UPDATE, DELETE e joins fundamentais.', 'video', 'iniciante', '1h 45min', 4.7, 'Banco de Dados', ARRAY['SQL', 'database', 'iniciante']),
  ('PostgreSQL Avançado', 'Otimização de queries, índices e performance tuning.', 'article', 'avançado', '2h 30min', 4.9, 'Banco de Dados', ARRAY['PostgreSQL', 'otimização', 'avançado']),
  ('NoSQL com MongoDB', 'Banco de dados orientado a documentos para aplicações modernas.', 'video', 'intermediário', '2h', 4.8, 'Banco de Dados', ARRAY['MongoDB', 'NoSQL', 'database']),
  ('Design de Banco de Dados', 'Normalização, modelagem ER e boas práticas.', 'pdf', 'iniciante', '2h 10min', 4.6, 'Banco de Dados', ARRAY['modelagem', 'design', 'database']),
  ('Redis: Cache e Performance', 'Use Redis para melhorar drasticamente a performance.', 'article', 'intermediário', '1h 30min', 4.8, 'Banco de Dados', ARRAY['Redis', 'cache', 'performance']),
  ('Transactions e ACID', 'Entenda propriedades ACID e gestão de transações.', 'video', 'intermediário', '1h 20min', 4.7, 'Banco de Dados', ARRAY['transactions', 'ACID', 'database']),
  ('Quiz: SQL Fundamentals', 'Teste seus conhecimentos sobre SQL e bancos relacionais.', 'quiz', 'iniciante', '15min', 4.5, 'Banco de Dados', ARRAY['quiz', 'SQL', 'avaliação']),
  ('Elasticsearch para Busca', 'Implemente busca full-text poderosa com Elasticsearch.', 'article', 'avançado', '2h 40min', 4.9, 'Banco de Dados', ARRAY['Elasticsearch', 'search', 'NoSQL']),
  ('Database Migration Strategies', 'Gerencie mudanças no schema com segurança.', 'video', 'intermediário', '1h 40min', 4.7, 'Banco de Dados', ARRAY['migration', 'database', 'devops']),
  ('Time Series Databases', 'Bancos especializados para dados temporais: InfluxDB, TimescaleDB.', 'pdf', 'avançado', '2h 20min', 4.8, 'Banco de Dados', ARRAY['time series', 'IoT', 'database']),

  -- DevOps e Cloud (6 items)
  ('Docker: Containers na Prática', 'Containerize suas aplicações com Docker.', 'video', 'iniciante', '2h 10min', 4.8, 'DevOps', ARRAY['Docker', 'containers', 'DevOps']),
  ('Kubernetes Essentials', 'Orquestração de containers em escala com Kubernetes.', 'article', 'avançado', '3h 30min', 4.9, 'DevOps', ARRAY['Kubernetes', 'orquestração', 'DevOps']),
  ('CI/CD com GitHub Actions', 'Automatize deploy e testes com GitHub Actions.', 'video', 'intermediário', '1h 50min', 4.7, 'DevOps', ARRAY['CI/CD', 'automation', 'DevOps']),
  ('AWS Cloud Fundamentals', 'Introdução aos serviços principais da Amazon Web Services.', 'pdf', 'iniciante', '2h 40min', 4.8, 'Cloud Computing', ARRAY['AWS', 'cloud', 'infraestrutura']),
  ('Infrastructure as Code com Terraform', 'Gerencie infraestrutura de forma declarativa.', 'article', 'avançado', '2h 30min', 4.9, 'DevOps', ARRAY['Terraform', 'IaC', 'cloud']),
  ('Quiz: DevOps Practices', 'Avalie seus conhecimentos sobre práticas DevOps modernas.', 'quiz', 'intermediário', '20min', 4.6, 'DevOps', ARRAY['quiz', 'DevOps', 'avaliação']);

-- Update achievements to be more realistic
UPDATE public.achievements SET
  title = 'Primeiro Passo',
  description = 'Complete seu primeiro conteúdo'
WHERE criteria_type = 'beginner_courses' AND criteria_value = 5;

UPDATE public.achievements SET
  title = 'Sequência de 7 Dias',
  description = 'Estude por 7 dias consecutivos'
WHERE criteria_type = 'study_streak' AND criteria_value = 7;

UPDATE public.achievements SET
  title = 'Quiz Champion',
  description = 'Complete 10 quizzes com sucesso'
WHERE criteria_type = 'quiz_streak' AND criteria_value = 10;

UPDATE public.achievements SET
  title = 'Estudante Dedicado',
  description = 'Complete 50 sessões de estudo'
WHERE criteria_type = 'study_sessions' AND criteria_value = 50;

UPDATE public.achievements SET
  title = 'Maratonista do Conhecimento',
  description = 'Acumule 100 horas de estudo'
WHERE criteria_type = 'total_study_hours' AND criteria_value = 100;

UPDATE public.achievements SET
  title = 'Expert em IA',
  description = 'Complete 10 conteúdos de Inteligência Artificial'
WHERE criteria_type = 'ai_courses' AND criteria_value = 10;
