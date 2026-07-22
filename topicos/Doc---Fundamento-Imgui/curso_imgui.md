```
================================================================================
                        CURSO COMPLETO DE DEAR IMGUI
                        Do Iniciante ao Avancado
================================================================================
  Base pratica: Projeto "Splinter" (splinter.slnx / splinter.vcxproj)
  Versao do codigo analisada: Julho 2026
================================================================================
```

# `INDICE` 

```
------
  CAPITULO 1  - Introducao a Dear ImGui
  CAPITULO 2  - Immediate Mode GUI vs Retained Mode GUI
  CAPITULO 3  - Arquitetura Interna da Biblioteca
  CAPITULO 4  - Estrutura dos Arquivos e Funcao de Cada Um
  CAPITULO 5  - Compilacao e Integracao em Projetos C++
  CAPITULO 6  - Inicializacao Completa
  CAPITULO 7  - ImGuiIO - Entrada e Configuracao
  CAPITULO 8  - ImGuiStyle - Tema e Customizacao
  CAPITULO 9  - Backends (Win32, DirectX 11)
  CAPITULO 10 - Ciclo Completo de Renderizacao
  CAPITULO 11 - Draw Lists e Renderizacao Interna
  CAPITULO 12 - Sistema de IDs
  CAPITULO 13 - Gerenciamento de Estado entre Frames
  CAPITULO 14 - Mouse, Teclado, Gamepad e Eventos
  CAPITULO 15 - Fontes
  CAPITULO 16 - Temas, Estilos e Cores
  CAPITULO 17 - Janelas, Child Windows, Popups e Modais
  CAPITULO 18 - Todos os Widgets Explicados
  CAPITULO 19 - Organizacao de Interfaces Grandes
  CAPITULO 20 - Menus Profissionais
  CAPITULO 21 - Docking e Multi-Viewport
  CAPITULO 22 - ImDrawList - Desenho Personalizado
  CAPITULO 23 - Widgets Personalizados
  CAPITULO 24 - Animacoes e Transicoes
  CAPITULO 25 - Sistema de Clipping
  CAPITULO 26 - Sistema de Layout
  CAPITULO 27 - Interfaces Responsivas
  CAPITULO 28 - Otimizacao de Desempenho
  CAPITULO 29 - Erros Comuns e Boas Praticas
  CAPITULO 30 - Arquitetura de Projetos com ImGui
  CAPITULO 31 - Depuracao de Problemas
  CAPITULO 32 - Renderizacao Ate a GPU
  CAPITULO 33 - Analise Completa do Projeto Splinter
  CAPITULO 34 - Projeto Minimo com Apenas a ImGui
```

```
1.1 - O que e a Dear ImGui?
---------------------------
Dear ImGui e uma biblioteca GUI C++ portavel, sem dependencias, que usa o
paradigma "Immediate Mode" (Modo Imediato). Diferente de bibliotecas
tradicionais
```

```
como Qt, wxWidgets ou WinForms, a Dear ImGui nao armazena uma arvore de widgets
persistente. Em vez disso, a interface e construida e desenhada quadro a quadro
dentro de um loop de renderizacao.
```

```
Criada por Omar Cornut (ocornut), a biblioteca e amplamente usada para:
```

- `Ferramentas de desenvolvimento (debuggers, profilers)` 

- `Editores de nivel e conteudo` 

- `Dashboards internos` 

- `Menus de jogos (especialmente cheats/mods)` 

- `Prototipacao rapida de interfaces` 

- `1.2 - Por que "ImGui"?` 

```
----------------------
```

```
O nome original era "ImGui" de "Immediate Mode GUI". Mais tarde foi renomeada
para "Dear ImGui" para evitar conflitos com outras bibliotecas.
```

```
1.3 - Caracteristicas Principais
```

```
---------------------------------
```

```
  - Modo Imediato: a interface e reconstruida a cada frame
```

```
  - Sem dependencias externas (apenas C++ e bibliotecas padrao)
```

```
  - Portavel: Windows, Linux, macOS, iOS, Android, Web (Emscripten)
  - Multiplos backends de renderizacao: DirectX 9/10/11/12, OpenGL 2/3/ES,
    Vulkan, Metal, SDL_Renderer, WebGPU
```

- `Multiplos backends de plataforma: Win32, GLFW, SDL2, GLUT, OSX` 

```
  - Suporte a Docking (janelas encaixaveis)
```

```
  - Suporte a Multi-Viewport (janelas fora da janela principal)
```

```
  - Fontes TTF/OTF com rasterizacao via stb_truetype ou FreeType
```

```
  - Sistema de estilo totalmente customizavel
```

- `Renderizacao via draw lists (vertices + indices + comandos)` 

```
1.4 - A Base "Splinter"
```

```
-----------------------
O projeto "Splinter" serve como nossa base pratica. Ele implementa:
```

```
  - Uma janela Win32 com bordas arredondadas e efeito acrylic
```

```
  - Renderizacao DirectX 11 com swap chain para composicao (DComp)
```

```
  - Um menu customizado com abas, pesquisa, notificacoes, watermark
  - Widgets customizados (checkbox, slider, dropdown, text input, button,
    keybind, color edit)
  - Sistema de animacoes suave (easing exponencial)
```

```
  - Sistema de busca/filtro
```

- `Tema escuro com cor de destaque (accent)` 

```
Arquitetura do projeto:
  splinter/
    splinter.vcxproj      - Projeto Visual Studio 2022
    ext/
      imgui/              - Nucleo da Dear ImGui (biblioteca original)
        imgui.h/.cpp
        imgui_draw.cpp
        imgui_widgets.cpp
        imgui_tables.cpp
        imgui_internal.h
        imconfig.h
        backends/
          imgui_impl_win32.h/.cpp   - Backend Win32
          imgui_impl_dx11.h/.cpp    - Backend DirectX 11
        misc/freetype/
          imgui_freetype.cpp        - Rasterizacao FreeType
      menu/               - Implementacao do menu Splinter
        app/main.cpp      - Ponto de entrada WinMain
        window/            - Janela Win32 personalizada
        gui/               - Inicializacao e renderizacao da GUI
        theme/             - Tema e estilo
        tabs/              - Sistema de abas
        assets/            - Fontes (Fredoka + icones)
        search/            - Barra de pesquisa
        elements/          - Elementos visuais
          widgets/         - Widgets customizados
          watermark/       - Watermark
          keybind list/    - Lista de binds ativos
          notifications/   - Notificacoes
```

```
================================================================================
CAPITULO 2: IMMEDIATE MODE GUI vs RETAINED MODE GUI
```

```
================================================================================
```

```
2.1 - Retained Mode GUI (Modo Retido)
```

```
---------------------------------------
```

```
Bibliotecas tradicionais (Qt, wxWidgets, WinForms, WPF) usam o modo retido:
```

- `O programador cria widgets uma vez e eles persistem` 

- `A biblioteca mantem uma arvore interna de objetos` 

- `Eventos de callback sao registrados (ex: onClick, onChanged)` 

- `O estado e gerenciado pela biblioteca` 

- `Exemplo Qt:` 

```
      QPushButton* btn = new QPushButton("Clique");
      connect(btn, &QPushButton::clicked, this, &MyClass::onClick);
```

- `2.2 - Immediate Mode GUI (Modo Imediato)` 

```
------------------------------------------
```

```
Dear ImGui usa o modo imediato:
```

- `A interface e construida do zero a cada frame (dentro do loop) - Nao ha arvore de widgets persistente` 

- `O estado e gerenciado pelo usuario (variaveis booleanas, floats, etc.) - A deteccao de interacao e feita pelo retorno das funcoes - Exemplo ImGui:` 

- `if (ImGui::Button("Clique")) {` 

   - `// acao executada quando o botao e clicado neste frame` 

- `}` 

- `2.3 - Vantagens do Modo Imediato` 

- `--------------------------------1. Simplicidade: nao ha necessidade de gerenciar ciclo de vida de widgets 2. Flexibilidade: a interface pode mudar drasticamente entre frames 3. Transparencia: voce ve exatamente o que sera desenhado 4. Integracao facil: basta incluir alguns arquivos e chamar funcoes 5. Depuracao: o estado e todo seu, nao escondido na biblioteca 6. Performance: sem alocacao de arvore de objetos complexa` 

# `2.4 - Desvantagens do Modo Imediato` 

- `------------------------------------` 

`1. Consumo de CPU: toda a interface e processada a cada frame` 

`2. Sem persistencia natural: scroll, foco, etc. precisam ser gerenciados` 

`3. Maior consumo para interfaces estaticas e complexas` 

`4. Nao ha separacao natural entre modelo e visao` 

- `2.5 - Diagrama Comparativo` 

- `---------------------------` 

- `RETAINED MODE:` 

```
    Criar Widgets --> Arvore Persistente --> Callbacks --> Updates Parciais
```

# `IMMEDIATE MODE:` 

```
    Loop: [Limpar Tela] --> [Construir Interface] --> [Desenhar] -->
[Apresentar]
```

```
================================================================================
CAPITULO 3: ARQUITETURA INTERNA DA BIBLIOTECA
```

```
================================================================================
```

# `3.1 - Visao Geral das 4 Camadas` 

```
---------------------------------
```

```
A Dear ImGui e organizada em 4 camadas principais que trabalham em conjunto
para processar entrada do usuario, construir a interface, e produzir comandos
de desenho que sao enviados a GPU:
```

```
                    +------------------------------------------+
```

```
                    |              APLICACAO                    |
```

```
                    |   (Splinter: gui.cpp, widgets, tabs...)  |
```

```
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |   CAMADA 1: CORE (imgui.h/.cpp)          |
                    |   - Contexto (ImGuiContext)              |
                    |   - IO (ImGuiIO)                         |
                    |   - Estilo (ImGuiStyle)                  |
                    |   - Gerenciamento de janelas            |
                    |   - Input processing                    |
                    |   - Layout system                       |
                    |   - ID stack / PushID / PopID           |
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |   CAMADA 2: WIDGETS (imgui_widgets.cpp)  |
                    |   - Button, Text, Slider, Checkbox      |
                    |   - Combo, ListBox, Selectable          |
                    |   - InputText, InputFloat, InputInt     |
                    |   - ColorEdit, ColorPicker              |
                    |   - TreeNode, CollapsingHeader          |
                    |   - Menu, MenuItem, Tooltip             |
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |   CAMADA 3: TABLES (imgui_tables.cpp)     |
                    |   - BeginTable / EndTable                |
                    |   - TableNextRow / TableNextColumn       |
                    |   - Columns, headers, borders            |
                    |   - Resize, reorder, sort                |
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |   CAMADA 4: DRAW (imgui_draw.cpp)         |
                    |   - ImDrawList (AddLine, AddRect, AddText)|
                    |   - ImDrawData (comandos agrupados)      |
                    |   - ImDrawCmd (comando individual)       |
                    |   - Clipping / Scissor Rect              |
                    |   - Anti-aliasing (AA)                   |
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |   BACKEND PLATAFORMA (imgui_impl_win32)   |
                    |   - Mouse, teclado, gamepad              |
                    |   - WM_ messages -> ImGuiIO              |
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |   BACKEND RENDER (imgui_impl_dx11)        |
                    |   - Cria buffers de vertices/indices     |
                    |   - Sends DrawIndexed a GPU              |
                    |   - Cria/gerencia font texture           |
                    +--------------------+---------------------+
                                         |
                                         v
                    +------------------------------------------+
                    |                  GPU                      |
                    |   DirectX 11, OpenGL, Vulkan, etc.       |
                    +------------------------------------------+
```

- `3.2 - Fluxo de Dados Completo` 

```
------------------------------
O fluxo de dados em cada frame segue esta sequencia:
```

`1. APLICACAO chama ImGui::NewFrame() via backend` 

`2. APLICACAO posiciona widgets (Button, Slider, etc.)` 

`3. Widgets chamam funcoes do ImDrawList para registrar primitivas` 

`4. ImGui::Render() fecha o frame e produz ImDrawData` 

`5. Backend de renderizacao processa ImDrawData` 

`6. Backend chama funcoes da GPU (DrawIndexed, etc.)` 

`7. Apresenta (Present/SwapChain)` 

```
Fluxo detalhado de cada widget:
```

- `Botao (ImGui::Button): -> PushID (unicidade)` 

- `-> Calcular tamanho (ItemSize)` 

- `-> Calcular posicao (ItemAdd)` 

- `-> Verificar hover (IsItemHovered)` 

- `-> Verificar click (IsMouseClicked)` 

- `-> Registrar retangulo (ImDrawList::AddRectFilled)` 

- `-> Registrar texto (ImDrawList::AddText) -> PopID` 

- `-> Retornar bool (clicado ou nao)` 

- `Slider (ImGui::SliderFloat): -> PushID` 

- `-> Calcular tamanho/layout -> Desenhar label` 

- `-> Desenhar barra/grip` 

- `-> Processar mouse drag` 

- `-> Atualizar valor (se arrastado)` 

- `-> PopID` 

- `-> Retornar bool (modificado ou nao)` 

# `3.3 - Estruturas Principais` 

```
----------------------------
```

# `3.3.1 - ImGuiContext` 

```
^^^^^^^^^^^^^^^^^^^^
```

```
ImGuiContext e a estrutura central que contem TODO o estado da biblioteca.
Cada contexto e independente. E criado por ImGui::CreateContext().
```

```
  struct ImGuiContext {
      bool                    Initialized;
```

```
      ImGuiIO                 IO;                    // Configuracao e entrada
      ImGuiPlatformIO         PlatformIO;            // IO da plataforma
      ImGuiStyle              Style;                 // Estilo/Tema atual
      ImGuiModFlags           ModFlags;              // Modifiers (Ctrl, Shift)
      ImGuiWindow*            CurrentWindow;         // Janela sendo processada
      ImDrawData              DrawData;              // Dados de desenho do
frame
      ImVector<ImGuiWindow*>  Windows;               // Todas as janelas abertas
      ImVector<ImGuiWindow*>  CurrentWindowStack;    // Pilha de janelas
      ImGuiID                 HoveredId;             // ID do item sob mouse
      ImGuiID                 ActiveId;              // ID do item ativo
      ImGuiID                 FocusScope;            // ID do escopo de foco
      ImGuiID                 NextWindowDataID;      // ID da proxima janela
      float                   CurrentItemFlags;      // Flags do item
      // ... centenas de outros campos
  };
```

```
O contexto e acessado via:
```

```
  ImGuiContext* ctx = ImGui::GetCurrentContext();
  ImGuiIO& io = ctx->IO;          // ou ImGui::GetIO()
  ImGuiStyle& style = ctx->Style; // ou ImGui::GetStyle()
```

```
IMPORTANTE: Quase toda funcao global da ImGui (ImGui::Button, ImGui::Text, etc.)
acessa ImGui::GetCurrentContext() internamente para obter o estado atual.
```

# `3.3.2 - ImGuiIO` 

```
^^^^^^^^^^^^^^^^
```

```
ImGuiIO e a estrutura de entrada/saida e configuracao. E o principal canal de
comunicacao entre a aplicacao e a biblioteca.
```

```
  struct ImGuiIO {
      // CONFIGURACAO
      ConfigFlags     ConfigFlags;        // Docking, Viewport, Nav, etc.
      ImVec2          DisplaySize;        // Tamanho da tela/janela em pixels
      float           DeltaTime;          // Tempo desde o ultimo frame
(segundos)
      float           FontGlobalScale;    // Escala global de fontes
      bool            FontAllowUserScaling;
      ImFontAtlas*    Fonts;              // Atlas de fontes
      float           MouseDrawCursor;    // Desenhar cursor do mouse?
      // ENTRADA DO TECLADO
      bool            KeysDown[512];      // Estado das teclas
      float           KeysDownDuration[512];
      float           KeysDownDurationPrev[512];
      int             KeyMap[ImGuiKey_COUNT];  // Mapeamento de teclas
      // ENTRADA DO MOUSE
      ImVec2          MousePos;           // Posicao do mouse (tela)
      bool            MouseDown[5];       // Botoes do mouse pressionados
      float           MouseWheel;         // Scroll vertical
      float           MouseWheelH;        // Scroll horizontal
      bool            MouseDrawCursor;
      // NAVEGACAO (gamepad)
      float           NavInputs[ImGuiNavInput_COUNT];
      bool            WantCaptureMouse;
      bool            WantCaptureKeyboard;
      bool            WantTextInput;
      bool            WantSetMousePos;
      // AVANCADO
      void*           ImeWindowHandle;    // Handle da janela para IME
      const char*     IniFilename;        // Arquivo .ini (NULL = sem
persistencia)
      const char*     LogFilename;
      float           BackendPlatformUserData;
      // ... mais campos
  };
```

```
3.3.3 - ImGuiStyle
^^^^^^^^^^^^^^^^^^
```

```
ImGuiStyle define todas as cores, tamanhos e espacamentos da interface.
```

# `struct ImGuiStyle {` 

```
      float       Alpha;                  // Opacidade global (1.0 = opaco)
      ImVec2      WindowPadding;          // Padding interno da janela
      float       WindowRounding;         // Arredondamento dos cantos
      float       WindowBorderSize;       // Espessura da borda
      ImVec2      FramePadding;           // Padding interno de botoes/frames
      float       FrameRounding;          // Arredondamento de botoes
      float       FrameBorderSize;
```

```
      ImVec2      ItemSpacing;            // Espaco entre itens na
horizontal/vertical
      ImVec2      ItemInnerSpacing;
      ImVec2      CellPadding;            // Padding em tabelas
      ImVec2      TouchExtraPadding;
      float       IndentSpacing;          // Espaco de indentacao
      float       ColumnsMinSpacing;
      float       ScrollbarSize;
      float       ScrollbarRounding;
      float       GrabMinSize;
      float       GrabRounding;
      float       LogSliderDeadzone;
      float       TabRounding;
      float       TabBorderSize;
      float       TabBarBorderSize;
      float       TableAngledHeadersAngle;
      ImVec2      ButtonTextAlign;
      ImVec2      SelectableTextAlign;
      ImVec2      DisplayWindowPadding;
      ImVec2      DisplaySafeAreaPadding;
      float       MouseCursorScale;
      bool        AntiAliasedLines;
      bool        AntiAliasedLinesUseTex;
      bool        AntiAliasedFill;
      float       CurveTessellationTol;
      float       CircleTessellationMaxError;
      ImVec4      Colors[ImGuiCol_COUNT]; // Vetor de 137+ cores
      // ... mais campos
  };
```

# `3.3.4 - ImGuiWindow` 

```
^^^^^^^^^^^^^^^^^^^
```

```
Cada janela na tela e representada por um ImGuiWindow. E criado na primeira
chamada a Begin() e destruido quando a janela e fechada.
```

```
  struct ImGuiWindow {
      char            Name[256];          // Nome da janela
      ImGuiID         ID;                 // ID unico (hash do nome + parent)
      ImGuiWindowFlags Flags;             // Flags (NoTitleBar, NoResize, etc.)
      ImVec2          Pos;                // Posicao da janela
      ImVec2          Size;               // Tamanho atual
      ImVec2          SizeFull;           // Tamanho sem scroll
      ImVec2          ContentSize;        // Tamanho do conteudo
      ImVec2          Scroll;             // Scroll atual
      ImVec2          ScrollMax;          // Scroll maximo
      float           ScrollX, ScrollY;
      bool            Collapsed;          // Recolhida?
      bool            WantClose;
      int             BeginCount;         // Quantas vezes Begin() foi chamado
      ImDrawList*     DrawList;           // Draw list principal da janela
      ImGuiID         PopupId;            // ID do popup (se for um popup)
      ImRect          ClipRect;           // Regiao de clipping
      ImRect          OuterRectClipped;
      ImRect          InnerRect;
      ImRect          ContentsRegionRect;
      // ... muitos outros campos
  };
```

# `3.3.5 - ImDrawList, ImDrawData, ImDrawCmd, ImDrawVert` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
ImDrawList e a lista de comandos de desenho de uma janela. Cada janela tem sua
propria draw list.
```

```
  struct ImDrawList {
      char            Name[64];
      ImVector<ImDrawCmd>     CmdBuffer;      // Comandos de desenho
      ImVector<ImDrawIdx>     IdxBuffer;      // Indices dos vertices
      ImVector<ImDrawVert>    VtxBuffer;      // Vertices
      ImDrawListFlags         Flags;          // Flags (AntiAliased, etc.)
      int                     _VtxCurrentOffset;
      int                     _IdxCurrentOffset;
      // Metodos: AddLine, AddRect, AddRectFilled, AddText, AddCircle, etc.
  };
```

```
ImDrawData contem todos os comandos de desenho de um frame completo.
```

```
  struct ImDrawData {
      bool            Valid;              // Dados validos?
      int             CmdListsCount;      // Numero de draw lists
      int             TotalIdxCount;      // Total de indices
      int             TotalVtxCount;      // Total de vertices
      ImDrawList**    CmdLists;           // Array de ponteiros para draw lists
      ImVec2          DisplayPos;         // Posicao da tela (geralmente 0,0)
      ImVec2          DisplaySize;        // Tamanho da tela
      ImVec2          FramebufferScale;   // Escala do framebuffer
  };
```

```
ImDrawCmd e um comando individual de desenho (um DrawIndexed).
```

```
  struct ImDrawCmd {
      ImVec4          ClipRect;           // Regiao de clipping (x1,y1,x2,y2)
      ImTextureID     TextureId;          // ID da textura (font atlas ou outra)
      unsigned int    VtxOffset;          // Offset no buffer de vertices
      unsigned int    IdxOffset;          // Offset no buffer de indices
      unsigned int    ElemCount;          // Numero de indices para desenhar
      ImDrawCallback  UserCallback;       // Callback opcional
      void*           UserCallbackData;
  };
```

```
ImDrawVert e um vertice individual.
```

```
  struct ImDrawVert {
      ImVec2  pos;            // Posicao (x, y)
      ImVec2  uv;             // Coordenada de textura (u, v)
      ImU32   col;            // Cor (RGBA 32-bit)
  };
```

```
3.3.6 - ImGuiStorage
^^^^^^^^^^^^^^^^^^^^
ImGuiStorage e um dicionario simples (chave-valor) usado internamente para
armazenar dados persistentes entre frames, como estados de colapso de nos.
```

```
  struct ImGuiStorage {
      ImVector<ImGuiStoragePair> Data;
      // Metodos:
      void    SetInt(ImGuiID key, int val);
      int     GetInt(ImGuiID key, int default_val = 0);
      void    SetBool(ImGuiID key, bool val);
      bool    GetBool(ImGuiID key, bool default_val = false);
      void    SetFloat(ImGuiID key, float val);
      float   GetFloat(ImGuiID key, float default_val = 0.0f);
      void*   GetVoidPtr(ImGuiID key);
      // ...
  };
```

```
Cada janela tem seu proprio ImGuiStorage (acessado via window->StateStorage)
para persistir estado entre frames, como TreeNode abertos/fechados, scroll
```

```
positions, etc.
```

```
3.4 - Diagrama de Interacao entre Estruturas
---------------------------------------------
```

```
  ImGui::CreateContext()
       |
       v
  +------------------+
  |  ImGuiContext    |----> IO (ImGuiIO)
  |                  |----> Style (ImGuiStyle)
  |                  |----> Windows[]
  |                  |----> CurrentWindow
  +------------------+
       |
       v
  ImGui::Begin("MinhaJanela")
       |
       v
  +------------------+
  |  ImGuiWindow     |----> Name = "MinhaJanela"
  |                  |----> ID = hash("MinhaJanela")
  |                  |----> DrawList (ImDrawList*)
  |                  |----> StateStorage (ImGuiStorage)
  +------------------+
       |
       v
  ImGui::Button("OK")
       |
       v
  +------------------+
  |  DrawList        |----> CmdBuffer[] (ImDrawCmd)
  |                  |----> VtxBuffer[] (ImDrawVert)
  |                  |----> IdxBuffer[] (ImDrawIdx)
  +------------------+
       |
       v
  ImGui::Render()
       |
       v
  +------------------+
  |  ImDrawData      |----> CmdLists[] (todas as draw lists)
  |                  |----> TotalVtxCount = N
  |                  |----> TotalIdxCount = M
  +------------------+
       |
       v
  Backend Render (imgui_impl_dx11)
       |
       v
  D3D11: CreateVertexBuffer, CreateIndexBuffer
         -> IASetVertexBuffers, IASetIndexBuffer
         -> DrawIndexed(ElemCount, IdxOffset, VtxOffset)
```

```
3.5 - Resumo do Capitulo
-------------------------
  - A Dear ImGui possui 4 camadas internas: Core, Widgets, Tables e Draw
  - Os backends (plataforma + renderizacao) conectam a biblioteca ao SO e GPU
  - ImGuiContext e o estado global de tudo
  - ImGuiIO recebe entrada do usuario e configuracoes
  - ImGuiStyle define o tema/cores
  - ImGuiWindow representa cada janela
  - ImDrawList contem comandos de desenho por janela
  - ImDrawData agrupa todas as draw lists do frame
```

- `ImDrawCmd e um comando DrawIndexed individual` 

- `ImDrawVert e um vertice com pos, uv e cor` 

- `ImGuiStorage e um dicionario para persistencia de estado` 

```
================================================================================
CAPITULO 4: ESTRUTURA DOS ARQUIVOS E FUNCAO DE CADA UM
```

```
================================================================================
```

# `4.1 - Introducao` 

- `-----------------` 

```
A Dear ImGui e distribuida como um conjunto de arquivos-fonte C++ que devem ser
compilados junto com o projeto. Alem do nucleo, existem arquivos de backend,
extensoes opcionais e o projeto Splinter com seus proprios modulos.
```

```
Entender a funcao de cada arquivo e essencial para:
```

- `Saber quais arquivos incluir no projeto` 

- `Depurar problemas de compilacao (erros em arquivos especificos)` 

- `Customizar comportamento (via imconfig.h)` 

- `Escolher backends e extensoes` 

# `4.2 - Nucleo da Dear ImGui (Obrigatorios)` 

```
-------------------------------------------
```

```
Estes arquivos formam o nucleo da biblioteca e sao SEMPRE necessarios:
```

```
4.2.1 - imgui.h
```

```
^^^^^^^^^^^^^^^
```

```
Arquivo de cabecalho principal. Contem:
```

- `Declaracoes de todas as funcoes publicas (ImGui::Button, etc.)` 

- `Definicoes de structs publicas: ImGuiIO, ImGuiStyle, ImDrawList, etc.` 

- `Enums: ImGuiWindowFlags, ImGuiInputTextFlags, ImGuiCol, etc.` 

- `Definicoes de tipos: ImTextureID, ImDrawIdx, ImWchar, etc.` 

- `Constantes: IMGUI_VERSION, GImGui, etc.` 

```
Tamanho tipico: ~9500 linhas.
```

```
Trecho ilustrativo (declaracao de Button):
```

```
  IMGUI_API bool          Button(const char* label, const ImVec2& size =
ImVec2(0, 0));
```

```
4.2.2 - imgui.cpp
```

```
^^^^^^^^^^^^^^^^^
```

```
Arquivo de implementacao principal. Contem:
```

- `Implementacao de ImGuiContext (CreateContext, DestroyContext)` 

- `Gerenciamento de janelas (Begin, End, BeginChild, EndChild)` 

- `Sistema de IDs (PushID, PopID, GetID)` 

- `Sistema de layout (ItemSize, ItemAdd, SameLine, Spacing, Dummy)` 

- `Gerenciamento de entrada (IsKeyPressed, IsMouseClicked, etc.)` 

- `Fontes (sistema de atlas criado em ImFontAtlas)` 

- `Sistema de estilo (PushStyleColor, PopStyleColor, etc.)` 

- `Sistema de popups, modais, tooltips` 

- `Sistema de grouping (BeginGroup, EndGroup)` 

- `Sistema de colunas antigo (Columns, NextColumn)` 

- `Persistencia .ini (SaveIniSettingsToMemory, LoadIniSettingsFromMemory)` 

- `Sistema de drag-and-drop` 

- `Sistema de clipping` 

- `Debug (ShowDemoWindow, ShowMetricsWindow, ShowStyleEditor)` 

- `Sistema de navegacao (Nav, gamepad)` 

```
Tamanho tipico: ~15000 linhas. E o maior arquivo da biblioteca.
```

```
4.2.3 - imgui_internal.h
^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo de cabecalho INTERNO. Nao faz parte da API publica.
Contem definicoes que sao internas a implementacao:
```

- `struct ImGuiContext (completa, com todos os campos internos)` 

- `struct ImGuiWindow (completa)` 

- `struct ImGuiWindowSettings` 

- `Estruturas internas: ImGuiNavItemData, ImGuiMetricsConfig, etc.` 

- `Funcoes internas: ImGui::ItemSize, ImGui::ItemAdd, etc.` 

- `Macros internos: IMGUI_DEBUG_LOG, IM_ASSERT, etc.` 

- `Declaracao de ImGuiTextBuffer, ImGuiStorage, etc.` 

```
Este arquivo e incluido por imgui.cpp, imgui_widgets.cpp, imgui_draw.cpp e
imgui_tables.cpp, mas NAO deve ser incluido pelo codigo do usuario.
```

# `4.2.4 - imgui_widgets.cpp` 

```
^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Implementacao de todos os widgets da biblioteca:
```

- `Button, ArrowButton, InvisibleButton, ImageButton` 

- `RadioButton, Checkbox` 

- `SliderFloat, SliderInt, SliderAngle, SliderScalar, VSlider` 

- `DragFloat, DragInt, DragScalar, DragFloatRange2, DragIntRange2` 

- `InputText, InputTextMultiline, InputFloat, InputInt, InputScalar` 

- `ColorEdit3, ColorEdit4, ColorPicker3, ColorPicker4, ColorButton` 

- `Combo, BeginCombo, EndCombo` 

- `ListBox, BeginListBox, EndListBox` 

- `Selectable` 

- `TreeNode, TreeNodeEx, TreePush, TreePop, CollapsingHeader` 

- `MenuItem, BeginMenu, EndMenu, BeginMainMenuBar, EndMainMenuBar` 

- `ProgressBar` 

- `Text, TextUnformatted, TextV, TextColored, TextDisabled, TextWrapped` 

- `LabelText, BulletText` 

- `Separator` 

- `PlotLines, PlotHistogram` 

- `Value (bool, int, unsigned int, float)` 

```
Cada widget segue o padrao:
```

`1. PushID (garantir unicidade)` 

`2. Calcular tamanho com estilo (style.FramePadding, etc.)` 

`3. ItemSize + ItemAdd (registrar no layout)` 

`4. Desenhar (AddRectFilled, AddText ao DrawList)` 

`5. Processar interacao (hover, click, drag)` 

`6. PopID` 

`7. Retornar bool (ativo, modificado, etc.)` 

```
Tamanho tipico: ~8000 linhas.
```

```
4.2.5 - imgui_draw.cpp
^^^^^^^^^^^^^^^^^^^^^^
```

```
Implementacao da camada de desenho (ImDrawList):
```

- `ImDrawList::AddLine, AddRect, AddRectFilled, AddRectFilledMultiColor` 

- `ImDrawList::AddCircle, AddCircleFilled` 

- `ImDrawList::AddTriangle, AddTriangleFilled` 

- `ImDrawList::AddQuad, AddQuadFilled` 

- `ImDrawList::AddNgon, AddNgonFilled` 

- `ImDrawList::AddText (desenho de texto com fonte)` 

- `ImDrawList::AddImage, AddImageQuad, AddImageRounded` 

- `ImDrawList::AddBezierCubic, AddBezierQuadratic` 

- `ImDrawList::PathClear, PathLineTo, PathArcTo, PathBezierCubicTo` 

- `ImDrawList::PathFillConvex, PathStroke` 

- `PrimitiveReserve, PrimQuadUV, PrimWriteVtx, PrimWriteIdx` 

- `Funcoes de renderizacao de font (ImFont::RenderChar, RenderText)` 

- `Funcoes de anti-aliasing` 

```
Tamanho tipico: ~6000 linhas.
```

# `4.2.6 - imgui_tables.cpp` 

```
^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Implementacao do sistema de tabelas:
```

- `BeginTable / EndTable` 

- `TableNextRow, TableNextColumn` 

- `TableSetupColumn, TableHeadersRow, TableHeader` 

- `Sistema de bordas, cores alternadas` 

- `Redimensionamento de colunas` 

- `Reordenacao de colunas (drag)` 

- `Ordenacao (sort) por coluna` 

- `Context menus em colunas` 

- `Freeze (colunas/linhas fixas)` 

- `Angled headers` 

```
Tamanho tipico: ~5000 linhas.
```

- `4.3 - Arquivos de Configuracao` 

```
-------------------------------
```

```
4.3.1 - imconfig.h
^^^^^^^^^^^^^^^^^^
Arquivo de configuracao do usuario. E incluido por imgui.h no inicio.
Permite customizar:
```

- `Tipos: ImTextureID, ImDrawIdx, ImWchar` 

- `Habilitar/desabilitar features: IMGUI_HAS_DOCK, IMGUI_HAS_VIEWPORT` 

- `Habilitar FreeType: IMGUI_ENABLE_FREETYPE` 

- `Habilitar STB: IMGUI_STB_NAMESPACE, IMGUI_DISABLE_STB_RECT_PACK` 

- `Definir alocadores customizados: ImGui::SetAllocatorFunctions` 

```
Exemplo do Splinter (imconfig.h):
  #define IMGUI_HAS_DOCK          1  // Habilita docking
  #define IMGUI_HAS_VIEWPORT      1  // Habilita multi-viewport
```

```
4.3.2 - imstb_truetype.h
^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Implementacao do rasterizador de fontes TrueType/OpenType da biblioteca stb
(Sean Barrett). Usado por padrao para carregar fontes TTF/OTF e gerar o atlas
de textura. E uma copia modificada do stb_truetype.h original.
```

```
4.3.3 - imstb_textedit.h
^^^^^^^^^^^^^^^^^^^^^^^^
Implementacao do editor de texto usado pelo widget InputTextMultiline.
Fornece funcionalidades de:
```

- `Cursor, selecao` 

- `Cut, copy, paste` 

- `Undo/redo` 

- `Word wrapping` 

- `Navegacao por setas, home, end, page up/down` 

```
4.3.4 - imstb_rectpack.h
^^^^^^^^^^^^^^^^^^^^^^^^
Implementacao do empacotador de retangulos (rectangle packer). Usado para
organizar as glyphs na textura do atlas de fontes (font texture atlas).
```

# `4.4 - Backends` 

- `---------------` 

```
4.4.1 - imgui_impl_win32.h / .cpp
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Backend de plataforma para Windows. Traduz mensagens Win32 (WM_*) em estado
ImGuiIO. Responsabilidades:
```

- `Inicializacao: ImGui_ImplWin32_Init(HWND)` 

- `Registro de handle de janela (WndProcHandler)` 

- `Processamento de mensagens: WM_MOUSEMOVE -> io.MousePos WM_LBUTTONDOWN/UP -> io.MouseDown[0]` 

```
      WM_RBUTTONDOWN/UP -> io.MouseDown[1]
      WM_MBUTTONDOWN/UP -> io.MouseDown[2]
      WM_MOUSEWHEEL -> io.MouseWheel
      WM_KEYDOWN/UP -> io.KeysDown[]
      WM_CHAR -> io.AddInputCharacter()
      WM_SETFOCUS/KILLFOCUS -> io.ClearInputKeys()
      WM_SIZE -> Atualiza display size
```

- `NewFrame: ImGui_ImplWin32_NewFrame()` 

- `Suporte a gamepad via XInput ou Win32 joystick` 

- `Suporte a IME (Input Method Editor) para texto internacional` 

```
4.4.2 - imgui_impl_dx11.h / .cpp
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Backend de renderizacao para DirectX 11. Responsabilidades:
```

- `Inicializacao: ImGui_ImplDX11_Init(ID3D11Device*, ID3D11DeviceContext*)` 

- `Criacao do vertex buffer e index buffer` 

- `Criacao do font texture atlas (ID3D11ShaderResourceView)` 

- `Criacao de shaders: vertex shader (imGui VS), pixel shader (imGui PS)` 

- `Criacao de input layout, blend state, rasterizer state, depth-stencil state` 

- `NewFrame: ImGui_ImplDX11_NewFrame() (reseta buffers)` 

- `RenderDrawData: processa ImDrawData e emite comandos DirectX 11` 

- `-> IASetInputLayout` 

- `-> IASetVertexBuffers, IASetIndexBuffer` 

- `-> RSSetScissorRects (para clipping)` 

- `-> PSSetShaderResources (texture atlas)` 

- `-> DrawIndexed(ElemCount, IdxOffset, VtxOffset)` 

- `Shutdown: libera todos os recursos DirectX 11` 

# `4.5 - Extensoes Opcionais` 

```
---------------------------
```

```
4.5.1 - imgui_freetype.cpp
^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Rasterizador alternativo de fontes usando FreeType em vez de stb_truetype.
Vantagens:
```

- `Melhor qualidade de rasterizacao (especialmente em tamanhos pequenos)` 

- `Suporte a hinting (LightHinting, MonoHinting, etc.)` 

- `Suporte a kerning avancado` 

- `Suporte a SVG em fontes OpenType` 

- `Suporte a codificacoes obsoletas (Symbol, AdobeCustom, etc.)` 

```
Para habilitar: #define IMGUI_ENABLE_FREETYPE em imconfig.h
Necessita linking com freetype.lib.
```

# `4.6 - Projeto Splinter (Arquivos Customizados)` 

```
-----------------------------------------------
```

```
O projeto Splinter adiciona seus proprios modulos sobre a Dear ImGui:
```

```
4.6.1 - app/main.cpp
```

```
^^^^^^^^^^^^^^^^^^^^
```

```
Ponto de entrada (WinMain). Contem:
```

- `Criacao da janela Win32 (WindowClass, CreateWindowEx)` 

- `Loop de mensagens (GetMessage/DispatchMessage)` 

- `Loop principal: NewFrame -> GUI -> Render -> Present` 

- `Inicializacao e shutdown de tudo` 

# `4.6.2 - window/ (Janela Win32 Personalizada)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  window.h/.cpp:
```

- `Criacao de janela sem bordas (WS_POPUP)` 

- `Cantos arredondados via DWM (DWM_WINDOW_CORNER_PREFERENCE)` 

- `Efeito acrylic/mica via DwmSetWindowAttribute` 

- `Captura e arrasto da janela (NC_HITTEST customizado)` 

- `Botao de fechar customizado` 

- `Handle de mensagens (WndProc)` 

# `4.6.3 - gui/ (Inicializacao e Renderizacao)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  gui.h/.cpp:
```

- `init(): CreateContext, configura IO, carrega fontes, configura estilo` 

- `render_gui(): loop principal de widgets (gui.cpp:34-174)` 

- `begin_frame() / end_frame(): molduras do frame` 

- `shutdown(): DestroyContext, libera recursos` 

- `Widgets posicionados: menu principal, abas, search bar, etc.` 

# `4.6.4 - theme/ (Tema e Estilo)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  theme.h/.cpp:
```

- `apply_theme(): configura ImGuiStyle e cores` 

- `Paleta de cores: accent, bg primario/secundario, texto, etc.` 

- `Tema escuro com acentos em tom unico (ex: azul, vermelho, roxo)` 

- `Splinter usa tons azulados (#4A9EFF como accent)` 

# `4.6.5 - tabs/ (Sistema de Abas)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  tabs.h/.cpp:
```

- `Estrutura Tab: nome, icone, conteudo (callback)` 

- `TabManager: lista de abas, aba ativa, navegacao` 

- `Desenho customizado de abas (nao usa TabBar da ImGui)` 

- `Animacao de transicao entre abas` 

```
4.6.6 - assets/ (Fontes e Recursos)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  assets.h/.cpp:
```

- `Carregamento de fontes (Fredoka Regular, variacoes)` 

- `Carregamento de icones (Font Awesome ou similar)` 

- `Configuracao de font sizes para diferentes usos` 

# `4.6.7 - search/ (Barra de Pesquisa)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  search.h/.cpp:
```

- `SearchBar widget customizado` 

- `InputText com icone de lupa` 

- `Filtragem de abas/conteudo por texto` 

- `Destaque de resultados encontrados` 

# `4.6.8 - elements/widgets/ (Widgets Customizados)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  checkbox.h/.cpp: Checkbox com animacao
  slider.h/.cpp:   Slider customizado (diferente do SliderFloat padrao)
  dropdown.h/.cpp: Dropdown com animacao
  text_input.h/.cpp: InputText com bordas arredondadas e placeholder
  button.h/.cpp:   Button com hover glow e ripple
  keybind.h/.cpp:  Keybind button (captura de tecla)
  color_edit.h/.cpp: ColorEdit customizado
```

# `4.6.9 - elements/watermark/ (Watermark)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  watermark.h/.cpp:
```

- `Renderizacao de texto semi-transparente no canto da tela` 

- `Nome do produto e versao` 

- `Frame rate (FPS) em tempo real` 

# `4.6.10 - elements/keybind list/ (Lista de Binds Ativos)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  keybind_list.h/.cpp:
```

- `Lista de atalhos de teclado ativos` 

- `Exibe tecla + descricao` 

- `Formata nomes de teclas (Ctrl+F, Alt+Tab, etc.)` 

```
4.6.11 - elements/notifications/ (Notificacoes)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  notifications.h/.cpp:
```

- `Sistema de notificacoes toast` 

- `Fila de notificacoes com timeout` 

- `Animacao de entrada/saida (fade, slide)` 

- `Cores diferentes para tipos: info, warning, error, success` 

- `4.7 - Mapa de Dependencias entre Arquivos` 

```
-------------------------------------------
```

```
  imgui.h (publico)
```

```
    |-- imconfig.h (customizacoes do usuario)
    |
    +--> imgui_internal.h (interno, NAO incluir no usuario)
           |
           +--> imgui.cpp (implementacao do core)
           +--> imgui_widgets.cpp (implementacao dos widgets)
           +--> imgui_draw.cpp (implementacao do desenho)
           +--> imgui_tables.cpp (implementacao das tabelas)
           |--> imstb_truetype.h (rasterizacao de fontes)
           |--> imstb_textedit.h (editor de texto multi-line)
           |--> imstb_rectpack.h (empacotador de retangulos)
```

```
  Backends (incluem imgui.h):
    imgui_impl_win32.h/.cpp
    imgui_impl_dx11.h/.cpp
```

```
  Extensoes:
```

```
    imgui_freetype.cpp (inclui imgui.h, imgui_internal.h)
```

```
  Codigo do usuario (Splinter):
    app/main.cpp
```

- `|-- window/window.h` 

```
      |-- gui/gui.h
```

- `|-- theme/theme.h` 

- `|-- tabs/tabs.h` 

- `|-- search/search.h` 

- `|-- elements/widgets/*.h` 

```
      |-- elements/watermark/*.h
```

- `|-- elements/keybind list/*.h` 

```
      |-- elements/notifications/*.h
```

- `|-- imgui_impl_win32.h` 

- `|-- imgui_impl_dx11.h` 

- `4.8 - Resumo do Capitulo` 

```
-------------------------
```

- `Nucleo obrigatorio: imgui.h, imgui.cpp, imgui_widgets.cpp, imgui_draw.cpp, imgui_tables.cpp, imgui_internal.h (interno)` 

- `Configuracao: imconfig.h` 

- `Bibliotecas stb: imstb_truetype.h, imstb_textedit.h, imstb_rectpack.h` 

- `Backends: imgui_impl_win32 (plataforma), imgui_impl_dx11 (renderizacao)` 

- `Extensao: imgui_freetype.cpp (rasterizacao FreeType)` 

- `Projeto Splinter: main.cpp, window/, gui/, theme/, tabs/, assets/, search/, elements/widgets/*, watermark/, keybind list/, notifications/` 

- `Cada arquivo tem uma responsabilidade bem definida` 

```
================================================================================
CAPITULO 5: COMPILACAO E INTEGRACAO EM PROJETOS C++
```

```
================================================================================
```

```
5.1 - Visao Geral
```

```
------------------
Integrar a Dear ImGui em um projeto C++ e um processo simples. Diferente de
bibliotecas como Qt ou wxWidgets, nao ha instalacao, linking complexo ou
ferramentas externas. Basta incluir os arquivos fonte no projeto e compilar.
```

```
Existem 3 abordagens principais:
  1. Compilar os arquivos .cpp diretamente no projeto
  2. Compilar como biblioteca estatica (.lib)
  3. Usar um gerenciador de pacotes (vcpkg, conan)
```

```
A abordagem 1 (compilar direto) e a mais comum e a usada pelo Splinter.
```

```
5.2 - Arquivos Necessarios
```

```
---------------------------
```

```
5.2.1 - Arquivos Obrigatorios
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Para qualquer projeto com Dear ImGui, voce PRECISA incluir:
```

```
  imgui.h               - Cabecalho principal
  imgui.cpp             - Implementacao do core
  imgui_widgets.cpp     - Implementacao dos widgets
  imgui_draw.cpp        - Implementacao da camada de desenho
  imgui_tables.cpp      - Implementacao das tabelas
  imgui_internal.h      - Cabecalho interno (incluido pelos .cpp)
  imconfig.h            - Configuracao do usuario
  imstb_truetype.h      - Rasterizacao de fontes TTF/OTF
  imstb_textedit.h      - Editor de texto (InputTextMultiline)
  imstb_rectpack.h      - Empacotador de glyphs no atlas
```

```
NOTA: Os arquivos .h (imstb_*) sao incluidos indiretamente pelos .cpp. Voce
precisa apenas certificar-se de que eles estao no include path.
```

```
5.2.2 - Backends (1 de cada tipo)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Voce precisa de UM backend de plataforma e UM backend de renderizacao.
Para o Splinter (Windows + DirectX 11):
```

```
  imgui_impl_win32.h / .cpp   - Backend de plataforma Win32
  imgui_impl_dx11.h / .cpp    - Backend de renderizacao DX11
Outras combinacoes comuns:
  GLFW + OpenGL:    imgui_impl_glfw + imgui_impl_opengl3
  SDL2 + Vulkan:    imgui_impl_sdl2 + imgui_impl_vulkan
  GLFW + Metal:     imgui_impl_glfw + imgui_impl_osx
  Win32 + OpenGL:   imgui_impl_win32 + imgui_impl_opengl3
5.2.3 - Arquivos Opcionais
^^^^^^^^^^^^^^^^^^^^^^^^^^^
  imgui_freetype.cpp    - Rasterizacao FreeType (melhor qualidade)
                         (requer freetype.lib e #define IMGUI_ENABLE_FREETYPE)
  imgui_demo.cpp        - Codigo fonte da demo window (ShowDemoWindow)
                         (util para aprendizado, pode ser removido em release)
  misc/cpp/imgui_stdlib.h/.cpp - Integracao com std::string (InputText)
```

```
5.3 - Configuracao do Projeto Visual Studio
```

```
--------------------------------------------
O Splinter usa splinter.vcxproj (Visual Studio 2022). Abaixo, a configuracao
completa explicada:
```

```
5.3.1 - Include Directories
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Diretorios onde o compilador procura por arquivos .h:
```

```
  $(ProjectDir)ext\imgui             - Nucleo da ImGui
  $(ProjectDir)ext\imgui\backends    - Backends (impl_win32, impl_dx11)
  $(ProjectDir)ext\imgui\misc\freetype - FreeType (se habilitado)
  $(ProjectDir)src                    - Codigo do Splinter (app, gui, etc.)
```

```
No .vcxproj:
  <ClCompile>
    <AdditionalIncludeDirectories>
      $(ProjectDir)ext\imgui;
      $(ProjectDir)ext\imgui\backends;
      $(ProjectDir)src;
      %(AdditionalIncludeDirectories)
    </AdditionalIncludeDirectories>
  </ClCompile>
```

```
5.3.2 - Preprocessor Defines
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Definicoes passadas ao compilador:
```

```
  IMGUI_HAS_DOCK=1        - Habilita sistema de docking (acoplamento de janelas)
  IMGUI_HAS_VIEWPORT=1    - Habilita multi-viewport (janelas fora da main)
  _CRT_SECURE_NO_WARNINGS - Suprime warnings de funcoes CRT inseguras
  NOMINMAX                - Evita que windows.h defina macros min/max
  WIN32_LEAN_AND_MEAN     - Inclui apenas o necessario do windows.h
  _UNICODE; UNICODE       - Suporte a caracteres Unicode
```

```
No .vcxproj:
  <ClCompile>
    <PreprocessorDefinitions>
      IMGUI_HAS_DOCK=1;
      IMGUI_HAS_VIEWPORT=1;
      _CRT_SECURE_NO_WARNINGS;
      NOMINMAX;
      WIN32_LEAN_AND_MEAN;
      _UNICODE;UNICODE;
      %(PreprocessorDefinitions)
    </PreprocessorDefinitions>
  </ClCompile>
```

```
5.3.3 - Bibliotecas de Ligacao (Linker)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Bibliotecas adicionais necessarias:
  d3d11.lib            - DirectX 11 (obrigatorio para backend DX11)
  dxgi.lib             - DirectX Graphics Infrastructure (criacao de swap chain)
  dcomp.lib            - Desktop Compositor (para efeito acrylic/transparencia)
  dwmapi.lib           - Desktop Window Manager (bordas arredondadas)
  freetype.lib         - FreeType (apenas se usar imgui_freetype.cpp)
No .vcxproj:
  <Link>
    <AdditionalDependencies>
      d3d11.lib;dxgi.lib;dcomp.lib;dwmapi.lib;
      %(AdditionalDependencies)
    </AdditionalDependencies>
  </Link>
```

```
5.3.4 - Language Standard
^^^^^^^^^^^^^^^^^^^^^^^^^^
A Dear ImGui requer C++11 ou superior. Recomenda-se C++17 ou C++20.
No .vcxproj:
  <ClCompile>
    <LanguageStandard>stdcpp17</LanguageStandard>
```

```
  </ClCompile>
```

```
5.3.5 - Arquivos Compilados
```

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
No .vcxproj, todos os .cpp devem ser listados em <ClCompile>:
```

```
  Nucleo ImGui:
    ext\imgui\imgui.cpp
    ext\imgui\imgui_widgets.cpp
    ext\imgui\imgui_draw.cpp
    ext\imgui\imgui_tables.cpp
```

```
  Backends:
    ext\imgui\backends\imgui_impl_win32.cpp
    ext\imgui\backends\imgui_impl_dx11.cpp
```

```
  FreeType (opcional):
    ext\imgui\misc\freetype\imgui_freetype.cpp
```

```
  Splinter:
    src\app\main.cpp
    src\gui\gui.cpp
    src\theme\theme.cpp
    src\tabs\tabs.cpp
    src\search\search.cpp
    src\window\window.cpp
    src\assets\assets.cpp
    src\elements\widgets\checkbox.cpp
    src\elements\widgets\slider.cpp
    src\elements\widgets\dropdown.cpp
    src\elements\widgets\text_input.cpp
    src\elements\widgets\button.cpp
    src\elements\widgets\keybind.cpp
    src\elements\widgets\color_edit.cpp
    src\elements\watermark\watermark.cpp
    src\elements\keybind list\keybind_list.cpp
    src\elements\notifications\notifications.cpp
```

# `5.4 - Inclusao no Codigo` 

```
--------------------------
```

```
Para usar a Dear ImGui, inclua o cabecalho principal:
```

```
  #include "imgui.h"
  #include "imgui_impl_win32.h"
  #include "imgui_impl_dx11.h"
```

```
IMPORTANTE: A ordem de inclusao geralmente nao importa, mas recomenda-se
incluir imgui.h primeiro.
```

```
5.5 - Compilacao com Makefile/CMake
```

```
-------------------------------------
```

```
5.5.1 - CMakeLists.txt basico
```

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  cmake_minimum_required(VERSION 3.14)
  project(MeuProjeto)
```

```
  set(CMAKE_CXX_STANDARD 17)
```

```
  # Fontes da ImGui
```

```
  set(IMGUI_SRC
      ext/imgui/imgui.cpp
      ext/imgui/imgui_widgets.cpp
```

```
      ext/imgui/imgui_draw.cpp
      ext/imgui/imgui_tables.cpp
      ext/imgui/backends/imgui_impl_win32.cpp
      ext/imgui/backends/imgui_impl_dx11.cpp
  )
  # Fontes do projeto
  set(PROJECT_SRC
      src/main.cpp
      src/gui/gui.cpp
      # ... outros .cpp
  )
  add_executable(${PROJECT_NAME} ${IMGUI_SRC} ${PROJECT_SRC})
  target_include_directories(${PROJECT_NAME} PRIVATE
      ext/imgui
      ext/imgui/backends
      src
  )
  target_compile_definitions(${PROJECT_NAME} PRIVATE
      IMGUI_HAS_DOCK=1
      IMGUI_HAS_VIEWPORT=1
      NOMINMAX
      WIN32_LEAN_AND_MEAN
  )
  target_link_libraries(${PROJECT_NAME} PRIVATE
      d3d11
      dxgi
      dcomp
      dwmapi
  )
```

```
5.5.2 - Makefile basico
^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  CXX = g++
  CXXFLAGS = -std=c++17 -Wall -O2
  INCLUDES = -Iext/imgui -Iext/imgui/backends -Isrc
  DEFINES = -DIMGUI_HAS_DOCK=1 -DIMGUI_HAS_VIEWPORT=1 -DNOMINMAX \
            -DWIN32_LEAN_AND_MEAN
  LIBS = -ld3d11 -ldxgi -ldcomp -ldwmapi
  IMGUI_SRC = ext/imgui/imgui.cpp ext/imgui/imgui_widgets.cpp \
              ext/imgui/imgui_draw.cpp ext/imgui/imgui_tables.cpp \
              ext/imgui/backends/imgui_impl_win32.cpp \
              ext/imgui/backends/imgui_impl_dx11.cpp
```

```
  PROJECT_SRC = src/main.cpp src/gui/gui.cpp # ... etc
  OBJS = $(IMGUI_SRC:.cpp=.o) $(PROJECT_SRC:.cpp=.o)
```

```
  all: meu_projeto
```

```
  meu_projeto: $(OBJS)
      $(CXX) $(CXXFLAGS) -o $@ $^ $(LIBS)
```

```
  %.o: %.cpp
      $(CXX) $(CXXFLAGS) $(INCLUDES) $(DEFINES) -c $< -o $@
```

```
  clean:
      rm -f *.o meu_projeto
```

- `5.6 - Erros Comuns de Compilacao` 

- `----------------------------------` 

`1. LINK 2001 / LNK 2019: simbolo externo nao resolvido Causa: faltou compilar imgui.cpp ou backend .cpp Solucao: adicione todos os .cpp obrigatorios ao projeto` 

`2. C1017: imconfig.h nao encontrado` 

- `Causa: include path nao cobre o diretorio da ImGui Solucao: adicione o diretorio ext/imgui aos include directories` 

`3. C1189: #error "Unknown platform" Causa: plataforma nao reconhecida (ex: falta WIN32_LEAN_AND_MEAN) Solucao: defina a macro de plataforma correta` 

`4. LINK 2001: unresolved external symbol _D3D11CreateDevice Causa: faltou adicionar d3d11.lib ao linker Solucao: adicione d3d11.lib em Additional Dependencies` 

`5. C2375: redefinition of 'min' / 'max'` 

- `Causa: macros min/max do windows.h conflitam com std::min/std::max Solucao: defina NOMINMAX antes de incluir windows.h` 

`6. C4996: 'strcpy': This function may be unsafe Causa: _CRT_SECURE_NO_WARNINGS nao definido Solucao: defina _CRT_SECURE_NO_WARNINGS` 

- `5.7 - Resumo do Capitulo` 

- `-------------------------` 

- `Integrar ImGui e simples: basta incluir os .cpp e .h no projeto` 

- `Nucleo obrigatorio: 6 arquivos .cpp (imgui, widgets, draw, tables, 2 backends)` 

- `Configuracao VS: include dirs, defines, libs (d3d11, dxgi, dcomp, dwmapi)` 

- `Opcionais: imgui_freetype, imgui_demo, imgui_stdlib` 

- `Erros comuns sao faceis de resolver: faltou incluir arquivo, lib ou define` 

```
================================================================================
CAPITULO 6: INICIALIZACAO COMPLETA
```

```
================================================================================
```

# `6.1 - Visao Geral` 

```
------------------
Inicializar a Dear ImGui requer 6 etapas bem definidas. Cada etapa prepara um
aspecto diferente da biblioteca. O Splinter implementa essas etapas em
main.cpp (chamada inicial) e gui.cpp (init()).
```

# `6.2 - As 6 Etapas da Inicializacao` 

- `------------------------------------` 

```
  ETAPA 1: Criar o contexto ImGui
```

```
  ETAPA 2: Configurar ImGuiIO (flags, display size, delta time)
```

```
  ETAPA 3: Inicializar backends (plataforma + renderizacao)
```

- `ETAPA 4: Carregar fontes ETAPA 5: Configurar estilo / tema ETAPA 6: Verificar inicializacao` 

```
Diagrama da sequencia:
```

```
  [Aplicacao Inicia]
```

```
        |
        v
  +-----------------------+
```

- `| 1. ImGui::CreateContext() |` 

```
  +-----------------------+
        |
        v
  +-----------------------+
  | 2. Configurar ImGuiIO  |
  +-----------------------+
        |
        v
  +-----------------------+
  | 3a. ImGui_ImplWin32_Init(hwnd) |
  +-----------------------+
        |
        v
  +-----------------------+
  | 3b. ImGui_ImplDX11_Init(device, context) |
  +-----------------------+
        |
        v
  +-----------------------+
  | 4. Carregar Fontes     |
  |    ImFontAtlas::AddFontFromFileTTF() |
  |    ImGui_ImplDX11_CreateDeviceObjects() |
  +-----------------------+
        |
        v
  +-----------------------+
  | 5. Configurar Estilo   |
  |    ImGui::GetStyle() = ... |
  +-----------------------+
        |
        v
  +-----------------------+
  | 6. Verificar (asserts) |
  +-----------------------+
        |
        v
  [Loop de Frames]
```

```
6.3 - Exemplo do Splinter (main.cpp:5-29) Detalhado
-----------------------------------------------------
Vamos analisar o codigo de inicializacao do Splinter linha a linha:
  // File: splinter/src/app/main.cpp (linhas 5-29 aproximado)
  //
  // WinMain - ponto de entrada do aplicativo Windows
  int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,
                     LPSTR lpCmdLine, int nCmdShow) {
      // --- ETAPA 0: Criacao da janela (antes da ImGui) ---
      WNDCLASSEX wc = {};
      wc.cbSize        = sizeof(WNDCLASSEX);
      wc.lpfnWndProc   = WindowProc;          // WndProc que tratara mensagens
      wc.hInstance     = hInstance;
      wc.lpszClassName = L"SplinterWindowClass";
      RegisterClassEx(&wc);
      HWND hwnd = CreateWindowEx(
          0, L"SplinterWindowClass", L"Splinter",
          WS_POPUP,                          // Janela sem bordas
          100, 100, 1280, 720,
          nullptr, nullptr, hInstance, nullptr
      );
```

```
      // --- ETAPA 1: Criar o contexto ImGui ---
      ImGui::CreateContext();
```

```
      // --- ETAPA 2: Configurar ImGuiIO ---
      ImGuiIO& io = ImGui::GetIO();
      io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;
      io.ConfigFlags |= ImGuiConfigFlags_ViewportsEnable;
      io.IniFilename = nullptr;              // Nao salvar estado .ini
```

```
      // --- ETAPA 3a: Inicializar backend Win32 ---
      ImGui_ImplWin32_Init(hwnd);
```

```
      // --- ETAPA 3b: Inicializar backend DX11 ---
```

```
      // (criacao do device e swap chain e feita separadamente em dx11.cpp:12-
53)
      ID3D11Device* device = ...;
      ID3D11DeviceContext* context = ...;
      ImGui_ImplDX11_Init(device, context);
```

```
      // --- ETAPA 4: Carregar fontes ---
```

```
      // (Feito em assets.cpp, chamado por gui.cpp:init())
      // ImFontAtlas* atlas = io.Fonts;
```

```
      // atlas->AddFontFromFileTTF("Fredoka-Regular.ttf", 16.0f);
      // atlas->AddFontFromFileTTF("fa-solid-900.ttf", 16.0f); // icones
```

```
      // --- ETAPA 5: Configurar estilo ---
```

```
      // (Feito em theme.cpp, chamado por gui.cpp:init())
      // apply_theme();
```

```
      // --- ETAPA 6: Verificar inicializacao ---
      IM_ASSERT(ImGui::GetCurrentContext() != nullptr);
      IM_ASSERT(io.Fonts->IsBuilt());
```

```
      // --- Loop Principal ---
      ShowWindow(hwnd, nCmdShow);
      MSG msg = {};
      while (msg.message != WM_QUIT) {
          if (PeekMessage(&msg, nullptr, 0, 0, PM_REMOVE)) {
              TranslateMessage(&msg);
              DispatchMessage(&msg);
              continue;
          }
```

```
          // NewFrame (backend + ImGui)
          ImGui_ImplDX11_NewFrame();
          ImGui_ImplWin32_NewFrame();
          ImGui::NewFrame();
```

```
          // Construir interface (gui.cpp)
          render_gui();
          // Renderizar
          ImGui::Render();
          // ... limpar backbuffer, RenderDrawData, Present
          // Multi-viewport: atualizar janelas secundarias
          if (io.ConfigFlags & ImGuiConfigFlags_ViewportsEnable) {
              ImGui::UpdatePlatformWindows();
              ImGui::RenderPlatformWindowsDefault();
          }
      }
```

```
      // Shutdown
      ImGui_ImplDX11_Shutdown();
```

```
      ImGui_ImplWin32_Shutdown();
      ImGui::DestroyContext();
      return 0;
  }
```

```
6.4 - init() do Splinter (gui.cpp:23-32)
-----------------------------------------
A funcao init() em gui.cpp e chamada apos CreateContext para configurar
detalhes adicionais:
```

```
  // File: splinter/src/gui/gui.cpp (linhas 23-32 aproximado)
  void gui::init() {
      ImGuiIO& io = ImGui::GetIO();
      // Configurar fontes
      io.Fonts->AddFontFromFileTTF("assets/Fredoka-Regular.ttf", 16.0f);
      // Carregar fontes de icones (Font Awesome)
      static const ImWchar icons_ranges[] = { ICON_MIN_FA, ICON_MAX_FA, 0 };
      ImFontConfig icons_config;
      icons_config.MergeMode = true;
      icons_config.PixelSnapH = true;
      io.Fonts->AddFontFromFileTTF("assets/fa-solid-900.ttf", 16.0f,
                                    &icons_config, icons_ranges);
```

```
      // Construir atlas (rasterizar todas as glyphs)
      unsigned char* pixels;
      int width, height;
      io.Fonts->GetTexDataAsRGBA32(&pixels, &width, &height);
```

```
      // Enviar textura para GPU (backend DX11)
      ImGui_ImplDX11_CreateDeviceObjects();
```

```
      // Aplicar tema
      apply_theme();
```

```
      // Configurar estilo adicional
      ImGuiStyle& style = ImGui::GetStyle();
      style.WindowRounding = 8.0f;
      style.FrameRounding = 4.0f;
      style.WindowBorderSize = 0.0f;
```

```
  }
```

```
Explicacao detalhada de cada linha:
```

```
  Linha 1-2: Obtem ImGuiIO para configurar fontes.
  Linha 5: Adiciona a fonte principal Fredoka-Regular.ttf com tamanho 16px.
  Linha 8-11: Adiciona a fonte de icones (Font Awesome) em modo MergeMode,
              que mescla os caracteres dos icones com a fonte principal.
              icons_ranges define o intervalo de codepoints dos icones FA.
              icons_config.MergeMode = true faz com que os glyphs sejam
              adicionados ao mesmo font atlas.
  Linha 14-16: Chama GetTexDataAsRGBA32 para gerar a textura do atlas de
               fontes em memoria (pixels RGBA 32-bit).
  Linha 19: Chama CreateDeviceObjects do backend DX11 para criar a textura
            na GPU (ShaderResourceView).
  Linha 22: apply_theme() configura todas as cores do estilo.
  Linha 25-27: Ajustes finais de estilo (rounding, border size).
```

```
6.5 - shutdown() (gui.cpp:177-181)
```

```
--------------------------------------
A funcao shutdown() faz o inverso de init(), liberando recursos:
```

```
  // File: splinter/src/gui/gui.cpp (linhas 177-181 aproximado)
```

```
  void gui::shutdown() {
      // Liberar recursos dos backends
      ImGui_ImplDX11_Shutdown();
      ImGui_ImplWin32_Shutdown();
      // Destruir contexto ImGui
      ImGui::DestroyContext();
  }
```

```
Explicacao:
```

```
  ImGui_ImplDX11_Shutdown(): Libera resources DirectX 11:
    - Vertex buffer
    - Index buffer
    - Font texture (ShaderResourceView)
    - Shaders (VS, PS)
    - Input layout, blend state, rasterizer state, depth-stencil state
```

```
  ImGui_ImplWin32_Shutdown(): Limpa recursos do backend Win32:
```

- `Remove o handler de WndProc (se instalado)` 

- `Limpa estado de gamepad` 

```
  ImGui::DestroyContext(): Libera toda a memoria alocada pelo contexto:
    - Todas as janelas abertas
```

- `Draw lists pendentes` 

- `Font atlas` 

- `Settings` 

- `O proprio ImGuiContext` 

```
6.6 - ImGui::CreateContext() Internamente
```

```
------------------------------------------
```

```
O que acontece quando voce chama ImGui::CreateContext()? Vamos ver os passos
internos:
```

```
  ImGuiContext* ImGui::CreateContext(ImFontAtlas* shared_font_atlas) {
      // 1. Alocar memoria para o contexto
      ImGuiContext* context = IM_NEW(ImGuiContext)(shared_font_atlas);
```

```
      // 2. Inicializar IO com valores padrao
      context->IO.IniFilename = "imgui.ini";  // Nome padrao do arquivo .ini
      context->IO.LogFilename = "imgui_log.txt";
      context->IO.BackendPlatformName = nullptr;
      context->IO.BackendRendererName = nullptr;
```

```
      // 3. Inicializar estilo com valores padrao (tema claro)
      context->Style = ImGuiStyle();  // Construtor define defaults
```

```
      // 4. Definir este contexto como o atual
      GImGui = context;  // Ponteiro global para o contexto atual
```

```
      // 5. Inicializar font padrao (ProggyClean / ProggyTiny)
      context->IO.Fonts->AddFontDefault();
```

```
      // 6. Inicializar sistema de teclas
      context->IO.KeyMap[ImGuiKey_Tab] = VK_TAB;
      context->IO.KeyMap[ImGuiKey_LeftArrow] = VK_LEFT;
      // ... mapeamento de todas as teclas
```

```
      // 7. Configurar backends customizados (se houver)
      // ...
```

```
      return context;
```

```
  }
Apos CreateContext, voce tem um contexto funcional, mas ainda sem:
  - Backends inicializados (sem entrada do usuario, sem renderizacao)
  - Fontes carregadas (apenas a fonte padrao ProggyClean 13px)
  - Estilo personalizado (apenas o tema claro padrao)
```

```
6.7 - Estrutura Completa do Contexto apos Inicializacao
---------------------------------------------------------
  ImGuiContext {
      Initialized = true
      IO {
          DisplaySize = (0, 0)        // Ainda nao definido
          DeltaTime = 1.0f / 60.0f   // 60 FPS default
          Fonts {
              Fonts[0] = ProggyClean 13px
              TexReady = false        // Ainda nao rasterizado
          }
          IniFilename = "imgui.ini"
      }
      Style {
          WindowPadding = (8, 8)
          FramePadding = (4, 3)
          Colors[ImGuiCol_WindowBg] = (0.94, 0.94, 0.94, 1.00) // Cinza claro
          Colors[ImGuiCol_Button] = (0.26, 0.59, 0.98, 0.40)
          // ... todas as cores com valores padrao claro
      }
      Windows = []                    // Nenhuma janela ainda
      CurrentWindow = nullptr
      DrawData { Valid = false }
  }
```

- `6.8 - Resumo do Capitulo` 

```
-------------------------
```

- `6 etapas de inicializacao: CreateContext, configurar IO, backends, fontes, estilo, verificacao` 

- `CreateContext aloca ImGuiContext e define valores padrao` 

- `init() do Splinter configura fontes (Fredoka + icones), cria textura na GPU, e aplica tema` 

- `shutdown() libera recursos dos backends e destroi o contexto` 

- `O contexto inicial contem apenas o basico (fonte ProggyClean, tema claro)` 

```
================================================================================
CAPITULO 7: ImGuiIO - ENTRADA E CONFIGURACAO
```

```
================================================================================
```

```
7.1 - O que e ImGuiIO?
```

```
-----------------------
```

```
ImGuiIO (Input/Output) e a estrutura central de comunicacao entre a aplicacao
e a Dear ImGui. Ela serve como:
```

- `Canal de entrada: backends escrevem estado do mouse, teclado, gamepad` 

- `Canal de saida: ImGui informa se quer capturar mouse/teclado` 

- `Configuracao: flags que alteram comportamento da biblioteca` 

```
Acessada via:
```

```
  ImGuiIO& io = ImGui::GetIO();
```

- `7.2 - Diagrama de Fluxo da Entrada` 

```
-------------------------------------
```

```
  [Windows]                    [Sistema Operacional]
```

```
     |                                |
```

```
     v                                v
```

```
  WM_MOUSEMOVE                  WM_KEYDOWN
  WM_LBUTTONDOWN                WM_KEYUP
  WM_RBUTTONDOWN                WM_CHAR
  WM_MOUSEWHEEL                 WM_SETFOCUS
  WM_SIZE                       WM_KILLFOCUS
     |                                |
     v                                v
  +----------------------------------------+
  |   imgui_impl_win32.cpp                 |
  |   (WndProcHandler)                     |
  |   Traduz WM_* em ImGuiIO fields       |
  +----------------------------------------+
     |                                |
     v                                v
  +----------------------------------------+
  |   ImGuiIO                              |
  |   MousePos, MouseDown[], KeysDown[],   |
  |   KeyMods, InputCharacters[], etc.     |
  +----------------------------------------+
     |                                |
     v                                v
  +----------------------------------------+
  |   ImGui::NewFrame()                    |
  |   Processa IO e gera estado interno   |
  +----------------------------------------+
     |                                |
     v                                v
  [Widgets detectam interacao]
```

```
7.3 - Todos os Campos Principais do ImGuiIO
---------------------------------------------
```

```
7.3.1 - Campos de Configuracao
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  ConfigFlags: ImGuiConfigFlags
    Controla funcionalidades globais:
      ImGuiConfigFlags_NavEnableKeyboard  - Navegacao por teclado
      ImGuiConfigFlags_NavEnableGamepad   - Navegacao por gamepad
      ImGuiConfigFlags_NoMouse            - Desabilitar mouse
      ImGuiConfigFlags_NoMouseCursorChange - Nao alterar cursor
      ImGuiConfigFlags_DockingEnable      - Habilitar docking
      ImGuiConfigFlags_ViewportsEnable    - Habilitar multi-viewport
      ImGuiConfigFlags_DpiEnableScaleViewports - Escalar viewports com DPI
      ImGuiConfigFlags_DpiEnableScaleFonts     - Escalar fontes com DPI
```

```
  IniFilename: const char*
```

```
    Caminho do arquivo .ini para persistencia. NULL = sem persistencia.
    Padrao: "imgui.ini"
```

```
  FontGlobalScale: float
```

```
    Escala global de fontes (1.0 = 100%). Ex: 1.5 = 150% maior.
```

```
  FontAllowUserScaling: bool
    Permite usuario escalar fontes com Ctrl+Mouse Wheel.
```

```
  DisplaySize: ImVec2
```

```
    Tamanho da tela/janela em pixels. Atualizado pelo backend em cada frame.
    Ex: DisplaySize = (1280, 720)
```

```
  DeltaTime: float
    Tempo decorrido desde o ultimo frame, em segundos.
    Usado para animacoes (multiplicador de velocidade).
    Ex: 0.016f = ~60 FPS
```

```
7.3.2 - Campos de Mouse
^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  MousePos: ImVec2
    Posicao atual do mouse em coordenadas de tela (-FLT_MAX,-FLT_MAX = fora).
    Atualizado via WM_MOUSEMOVE:
      case WM_MOUSEMOVE:
          io.MousePos.x = (float)GET_X_LPARAM(lParam);
          io.MousePos.y = (float)GET_Y_LPARAM(lParam);
          return 0;
```

```
  MouseDown[5]: bool
    Estado de cada botao do mouse (0=left, 1=right, 2=middle, 3=extra1,
4=extra2).
    Atualizado via WM_*BUTTONDOWN/UP:
      case WM_LBUTTONDOWN:
          io.MouseDown[0] = true;
          return 0;
      case WM_LBUTTONUP:
          io.MouseDown[0] = false;
          return 0;
      case WM_RBUTTONDOWN:
          io.MouseDown[1] = true;
          return 0;
      // ... similar para MButton, XButton
  MouseWheel: float
    Scroll do mouse (vertical). Positivo = scroll para cima.
    Atualizado via WM_MOUSEWHEEL:
      case WM_MOUSEWHEEL:
          io.MouseWheel += (float)GET_WHEEL_DELTA_WPARAM(wParam) /
(float)WHEEL_DELTA;
          return 0;
```

```
  MouseWheelH: float
    Scroll horizontal.
  MouseDownDuration[5]: float
    Tempo que cada botao esta pressionado (0 = nao pressionado).
    Util para detectar segurar botao.
```

```
  MouseClicked[5]: bool
    True no frame em que o botao foi clicado.
```

```
  MouseDoubleClicked[5]: bool
    True no frame em que ocorreu duplo clique.
```

```
  MouseClickedPos[5]: ImVec2
    Posicao onde o clique ocorreu.
```

```
  MouseClickedTime[5]: float
    Timestamp do clique.
```

```
  MousePosPrev: ImVec2
    Posicao do mouse no frame anterior.
```

# `7.3.3 - Campos de Teclado` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  KeysDown[512]: bool
```

```
    Estado de cada tecla. Indexado por virtual key code (VK_*).
    Atualizado via WM_KEYDOWN / WM_SYSKEYDOWN / WM_KEYUP / WM_SYSKEYUP:
      case WM_KEYDOWN:
```

```
          io.KeysDown[wParam] = true;
          return 0;
      case WM_KEYUP:
          io.KeysDown[wParam] = false;
          return 0;
```

```
  KeysDownDuration[512]: float
    Tempo que cada tecla esta pressionada.
  KeyMap[ImGuiKey_COUNT]: int
    Mapeamento de teclas ImGuiKeys para scancodes/VKs:
      io.KeyMap[ImGuiKey_Tab] = VK_TAB;
      io.KeyMap[ImGuiKey_LeftArrow] = VK_LEFT;
      io.KeyMap[ImGuiKey_RightArrow] = VK_RIGHT;
      io.KeyMap[ImGuiKey_UpArrow] = VK_UP;
      io.KeyMap[ImGuiKey_DownArrow] = VK_DOWN;
      // ... etc
```

```
  KeyCtrl, KeyShift, KeyAlt, KeySuper: bool
    Estado das teclas modificadoras.
    Atualizado via WM_KEYDOWN/UP para VK_CONTROL, VK_SHIFT, VK_MENU, VK_LWIN.
```

```
  InputQueueCharacters: ImVector<ImWchar>
    Fila de caracteres digitados. Preenchido via WM_CHAR:
      case WM_CHAR:
          io.AddInputCharacter((unsigned int)wParam);
          return 0;
```

```
7.3.4 - Campos de Navegacao (Gamepad)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  NavInputs[ImGuiNavInput_COUNT]: float
    Valores analogicos do gamepad:
      ImGuiNavInput_Activate      - Botao A (XB) / Cruz (PS)
      ImGuiNavInput_Cancel        - Botao B (XB) / Circulo (PS)
      ImGuiNavInput_Input         - Botao X (XB) / Quadrado (PS)
      ImGuiNavInput_Menu          - Botao Y (XB) / Triangulo (PS)
      ImGuiNavInput_DpadLeft      - D-Pad esquerda
      ImGuiNavInput_DpadRight     - D-Pad direita
      ImGuiNavInput_DpadUp        - D-Pad cima
      ImGuiNavInput_DpadDown      - D-Pad baixo
      ImGuiNavInput_LStickLeft    - Analogico esquerda
      ImGuiNavInput_LStickRight   - Analogico direita
      ImGuiNavInput_LStickUp      - Analogico cima
      ImGuiNavInput_LStickDown    - Analogico baixo
```

```
  NavActive: bool
```

```
    Navegacao esta ativa (mouse nao esta sendo usado).
```

```
  NavVisible: bool
    Navegacao esta visivel (highlight navegavel).
```

```
7.3.5 - Campos de Saida
^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  WantCaptureMouse: bool (saida)
```

```
    True quando um widget esta usando o mouse. Se true, a aplicacao nao deve
    processar o clique (ex: nao atirar no jogo enquanto clica em um botao).
```

```
  WantCaptureKeyboard: bool (saida)
```

```
    True quando um widget esta usando o teclado (ex: InputText).
```

```
  WantTextInput: bool (saida)
```

```
    True quando um InputText esta ativo e precisa de caracteres.
```

```
  WantSetMousePos: bool (saida)
    True quando ImGui quer reposicionar o mouse (ex: arrastando slider).
```

```
7.4 - Como os Backends Preenchem o ImGuiIO
```

```
-------------------------------------------
```

```
O backend imgui_impl_win32.cpp implementa um WndProcHandler que processa as
mensagens do Windows e preenche os campos do ImGuiIO:
```

```
  // Exemplo simplificado do WndProcHandler
  IMGUI_IMPL_API LRESULT ImGui_ImplWin32_WndProcHandler(
      HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
  {
      ImGuiIO& io = ImGui::GetIO();
```

```
      switch (msg) {
      case WM_LBUTTONDOWN:
      case WM_LBUTTONDBLCLK:
          io.MouseDown[0] = true;
          return 0;
      case WM_RBUTTONDOWN:
      case WM_RBUTTONDBLCLK:
          io.MouseDown[1] = true;
          return 0;
      case WM_MBUTTONDOWN:
      case WM_MBUTTONDBLCLK:
          io.MouseDown[2] = true;
          return 0;
      case WM_LBUTTONUP:
          io.MouseDown[0] = false;
          return 0;
      case WM_RBUTTONUP:
          io.MouseDown[1] = false;
          return 0;
      case WM_MBUTTONUP:
          io.MouseDown[2] = false;
          return 0;
      case WM_MOUSEWHEEL:
          io.MouseWheel += (float)GET_WHEEL_DELTA_WPARAM(wParam) /
(float)WHEEL_DELTA;
          return 0;
      case WM_MOUSEHWHEEL:
          io.MouseWheelH += (float)GET_WHEEL_DELTA_WPARAM(wParam) /
(float)WHEEL_DELTA;
          return 0;
      case WM_KEYDOWN:
      case WM_SYSKEYDOWN:
          if (wParam < 256)
              io.KeysDown[wParam] = true;
          return 0;
      case WM_KEYUP:
      case WM_SYSKEYUP:
          if (wParam < 256)
              io.KeysDown[wParam] = false;
          return 0;
```

```
      case WM_CHAR:
          // Adiciona caractere a fila de entrada
          io.AddInputCharacter((unsigned int)wParam);
          return 0;
```

```
      case WM_SETCURSOR:
          if (LOWORD(lParam) == HTCLIENT) {
              // Deixa ImGui gerenciar o cursor
              return 1;
          }
          return 0;
```

```
      case WM_DEVICECHANGE:
          // Gamepad conectado/desconectado
          return 0;
      }
```

```
      return 0;
  }
```

```
7.5 - Configuracoes Uteis (Docking, Viewport, Nav)
```

```
----------------------------------------------------
```

- `7.5.1 - Docking (ImGuiConfigFlags_DockingEnable) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^` 

- `Habilita o sistema de acoplamento de janelas (dock). Com esta flag: - Janelas podem ser arrastadas para dockspaces` 

- `Abas podem ser reorganizadas entre docks` 

- `E possivel criar layouts com multiplos paineis acoplaveis` 

```
  io.ConfigFlags |= ImGuiConfigFlags_DockingEnable;
```

- `Para usar dockspace: ImGui::DockSpaceOverViewport(); // ou ImGui::DockSpace(dockspace_id);` 

- `7.5.2 - Multi-Viewport (ImGuiConfigFlags_ViewportsEnable) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^` 

- `Habilita janelas fora da janela principal do aplicativo: - Cada janela ImGui vira uma janela nativa do SO` 

- `Suporta arrastar janelas entre monitors - Requer que o backend de plataforma suporte multiplas janelas` 

```
  io.ConfigFlags |= ImGuiConfigFlags_ViewportsEnable;
```

- `E necessario chamar no loop principal:` 

- `if (io.ConfigFlags & ImGuiConfigFlags_ViewportsEnable) { ImGui::UpdatePlatformWindows(); ImGui::RenderPlatformWindowsDefault(); }` 

- `7.5.3 - Navegacao por Teclado (ImGuiConfigFlags_NavEnableKeyboard) ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Habilita navegacao por teclado (TAB, setas, Enter, Esc): - Tab/Shift+Tab para navegar entre widgets` 

- `Setas para navegar em listas, sliders, etc. - Enter para ativar, Esc para sair` 

```
  io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
```

```
7.5.4 - Navegacao por Gamepad (ImGuiConfigFlags_NavEnableGamepad)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Habilita navegacao por controle:
```

- `Funciona com XInput e DirectInput` 

- `Analogico para navegacao, botoes para acao` 

- `Suporta mapeamento de botoes customizado` 

```
7.6 - DeltaTime para Animacoes
-------------------------------
DeltaTime e o campo mais importante para animacoes suaves. Ele representa o
tempo entre o frame atual e o anterior, em segundos.
```

```
  // O backend geralmente calcula DeltaTime assim:
  static LARGE_INTEGER freq;
  QueryPerformanceFrequency(&freq);
  static LARGE_INTEGER last_time;
  QueryPerformanceCounter(&last_time);
```

```
  // A cada frame:
  LARGE_INTEGER now;
  QueryPerformanceCounter(&now);
  io.DeltaTime = (float)(now.QuadPart - last_time.QuadPart) / freq.QuadPart;
  last_time = now;
```

```
  // Ou usando GetTickCount64:
  static UINT64 last_time = GetTickCount64();
  UINT64 now = GetTickCount64();
  io.DeltaTime = (now - last_time) / 1000.0f;
  last_time = now;
```

```
Usando DeltaTime para animacoes:
```

```
  // Animacao de opacidade
  float opacity = 0.0f;
  float speed = 2.0f; // segundos para completar
  void update_animation() {
      if (should_fade_in) {
          opacity += io.DeltaTime * speed;
          if (opacity > 1.0f) opacity = 1.0f;
      }
  }
  // Usar opacity para PushStyleVar/Color
  ImGui::PushStyleVar(ImGuiStyleVar_Alpha, opacity);
  ImGui::Button("Fade In Button");
  ImGui::PopStyleVar();
7.7 - DisplaySize e WM_SIZE
-----------------------------
DisplaySize informa a ImGui o tamanho da superficie de desenho. Deve ser
atualizado sempre que a janela for redimensionada.
```

```
  // No WndProc, tratar WM_SIZE:
  case WM_SIZE:
      io.DisplaySize.x = (float)LOWORD(lParam);
      io.DisplaySize.y = (float)HIWORD(lParam);
```

```
      // Se estiver usando DX11, redimensionar swap chain tambem
      if (g_pSwapChain && wParam != SIZE_MINIMIZED) {
          // Liberar render target view
          // g_pd3dDeviceContext->OMSetRenderTargets(...)
          // g_pSwapChain->ResizeBuffers(...)
          // Recriar render target view
      }
      return 0;
```

```
O DisplaySize deve ser definido ANTES de ImGui::NewFrame().
```

```
7.8 - Propriedades de Leitura (Saida do ImGui)
```

```
------------------------------------------------
```

```
Alem de escrever dados de entrada, a aplicacao pode LER propriedades do ImGui
para saber o estado da interface:
```

```
  bool io.WantCaptureMouse;
  bool io.WantCaptureKeyboard;
  bool io.WantTextInput;
  bool io.WantSetMousePos;
```

```
Exemplo tipico em um jogo:
```

```
  ImGuiIO& io = ImGui::GetIO();
  ImGui_ImplDX11_NewFrame();
  ImGui_ImplWin32_NewFrame();
  ImGui::NewFrame();
  // Construir interface...
  // ...
```

```
  ImGui::Render();
```

```
  // So processar entrada do jogo se ImGui nao estiver usando
  if (!io.WantCaptureMouse) {
      // Processar clique do jogo (atirar, etc.)
      if (mouse_left_clicked) {
          player.shoot();
      }
  }
  if (!io.WantCaptureKeyboard) {
      // Processar teclado do jogo (movimentacao, etc.)
      if (key_pressed['W']) player.move_forward();
  }
```

```
7.9 - Metodos Uteis do ImGuiIO
-------------------------------
  io.AddInputCharacter(c)     - Adiciona caractere Unicode a fila
  io.AddInputCharacterUTF16(c)- Adiciona caractere UTF-16
  io.ClearInputKeys()         - Limpa todas as teclas
  io.SetKeyEventNativeData(key, native_keycode, native_scancode) - Dados nativos
  io.AddFocusEvent(focused)   - Evento de foco (true = ganhou foco)
  io.MetricsRenderVertices    - (leitura) vertices renderizados no frame
  io.MetricsRenderIndices     - (leitura) indices renderizados no frame
  io.MetricsRenderWindows     - (leitura) janelas renderizadas
```

```
7.10 - Resumo do Capitulo
```

```
--------------------------
```

```
  - ImGuiIO e a ponte entre aplicacao/backend e a biblioteca
```

```
  - Mouse: MousePos, MouseDown[], MouseWheel - preenchido por WM_MOUSE*
```

```
  - Teclado: KeysDown[], InputQueueCharacters - preenchido por WM_KEY*/WM_CHAR
```

- `ConfigFlags: Docking, Viewport, NavEnableKeyboard, NavEnableGamepad` 

- `DeltaTime: essencial para animacoes consistentes entre quadros` 

- `DisplaySize: atualizado via WM_SIZE antes de NewFrame` 

- `WantCaptureMouse/Keyboard: saida que indica se ImGui esta ativo` 

- `Backend Win32 traduz mensagens Windows para campos do ImGuiIO` 

```
================================================================================
CAPITULO 8: ImGuiStyle - TEMA E CUSTOMIZACAO
```

```
================================================================================
```

```
8.1 - O que e ImGuiStyle?
```

```
---------------------------
```

```
ImGuiStyle e a estrutura que define a aparencia visual de toda a interface.
Ela contem:
```

- `Espacamentos (paddings, margins, gaps)` 

- `Arredondamentos (rounding de cantos)` 

- `Tamanhos (scrollbar, grab, borders)` 

- `Paleta de cores (137+ indices de cor ImGuiCol)` 

- `Configuracoes de anti-aliasing` 

```
Acessada via:
```

```
  ImGuiStyle& style = ImGui::GetStyle();
```

- `8.2 - Visao Geral dos Campos` 

```
------------------------------
```

```
   Categoria             | Campos Principais
  -----------------------|---------------------------------------------------
   Janela                | WindowPadding, WindowRounding, WindowBorderSize,
                         | WindowMinSize, WindowTitleAlign,
WindowMenuButtonPosition
   Frame (botoes, etc)   | FramePadding, FrameRounding, FrameBorderSize
   Itens                 | ItemSpacing, ItemInnerSpacing, IndentSpacing
   Celulas (tabelas)     | CellPadding
   Scrollbar             | ScrollbarSize, ScrollbarRounding
   Grab (sliders)        | GrabMinSize, GrabRounding
   Abas                  | TabRounding, TabBorderSize, TabBarBorderSize,
                         | TabAngledHeadersAngle
   Texto                 | ButtonTextAlign, SelectableTextAlign
   Display               | DisplayWindowPadding, DisplaySafeAreaPadding
   Mouse                 | MouseCursorScale
   Misc                  | Alpha, AntiAliasedLines, AntiAliasedFill,
                         | CurveTessellationTol, CircleTessellationMaxError
```

- `8.3 - Todos os Campos de Estilo Explicados` 

```
--------------------------------------------
```

```
8.3.1 - Campos de Janela (Window*)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  WindowPadding (ImVec2)
    Padding interno da janela (espaco entre borda e conteudo).
    Padrao: (8, 8). Valores maiores = mais espaco dentro das janelas.
    Ex: style.WindowPadding = ImVec2(16, 16);
```

# `WindowRounding (float)` 

```
    Raio do arredondamento dos cantos da janela.
    0 = cantos retos. 8-12 = cantos suavemente arredondados.
    Ex: style.WindowRounding = 8.0f;
```

```
  WindowBorderSize (float)
    Espessura da borda da janela em pixels.
    0 = sem borda. 1 = borda fina.
    Ex: style.WindowBorderSize = 0.0f; // sem borda (visual moderno)
```

```
  WindowMinSize (ImVec2)
    Tamanho minimo que a janela pode ter.
    Padrao: (32, 32).
```

# `WindowTitleAlign (ImVec2)` 

```
    Alinhamento do texto do titulo. (0,0)=esquerda, (0.5,0.5)=centro.
    Ex: style.WindowTitleAlign = ImVec2(0.5f, 0.5f); // centralizado
```

```
  WindowMenuButtonPosition (ImGuiDir)
    Posicao do botao de menu da janela. ImGuiDir_Left ou ImGuiDir_None.
```

```
    Ex: style.WindowMenuButtonPosition = ImGuiDir_None; // sem botao de menu
```

```
8.3.2 - Campos de Frame (Frame*)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  FramePadding (ImVec2)
    Padding interno de widgets como Button, Checkbox, Slider, InputText.
    Padrao: (4, 3). Aumentar = botoes maiores.
    Ex: style.FramePadding = ImVec2(8, 6);
  FrameRounding (float)
    Raio do arredondamento dos cantos de frames (botoes, inputs, etc.).
    0 = reto. 4-6 = arredondamento comum.
    Ex: style.FrameRounding = 4.0f;
  FrameBorderSize (float)
    Espessura da borda de frames.
    0 = sem borda. 1 = borda fina.
    Ex: style.FrameBorderSize = 1.0f;
8.3.3 - Campos de Espacamento entre Itens
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ItemSpacing (ImVec2)
    Espaco horizontal/vertical entre widgets (nao entre frames).
    Padrao: (8, 4).
    Ex: style.ItemSpacing = ImVec2(10, 6);
  ItemInnerSpacing (ImVec2)
    Espaco interno entre elementos de um mesmo widget (ex: texto e seta do
combo).
    Padrao: (4, 4).
  IndentSpacing (float)
    Largura da indentacao (usada por TreeNode, etc.).
    Padrao: 21.0f.
    Ex: style.IndentSpacing = 24.0f;
  CellPadding (ImVec2)
    Padding dentro de celulas de tabelas (BeginTable).
    Padrao: (4, 2).
8.3.4 - Campos de Scrollbar
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ScrollbarSize (float)
    Largura da scrollbar vertical / altura da scrollbar horizontal.
    Padrao: 14.0f. Menor = mais fina.
    Ex: style.ScrollbarSize = 10.0f;
```

```
  ScrollbarRounding (float)
    Arredondamento dos cantos da scrollbar.
    Ex: style.ScrollbarRounding = 4.0f;
```

```
8.3.5 - Campos de Grab (Slider/Drag)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  GrabMinSize (float)
    Tamanho minimo do "grab" (alca) de sliders e drags.
    Padrao: 10.0f.
    Ex: style.GrabMinSize = 8.0f;
```

```
  GrabRounding (float)
    Arredondamento dos cantos do grab.
```

```
    Ex: style.GrabRounding = 4.0f;
```

```
8.3.6 - Campos de Abas (Tab*)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  TabRounding (float)
    Arredondamento dos cantos das abas.
    Ex: style.TabRounding = 4.0f;
```

```
  TabBorderSize (float)
    Espessura da borda das abas.
    Ex: style.TabBorderSize = 1.0f;
```

```
  TabBarBorderSize (float)
    Espessura da borda da barra de abas.
    Ex: style.TabBarBorderSize = 0.0f;
```

```
  TabAngledHeadersAngle (float)
    Angulo para cabecalhos inclinados em tabelas (em radianos).
    Ex: style.TabAngledHeadersAngle = 0.0f; // sem inclinacao
```

```
8.3.7 - Outros Campos
```

```
^^^^^^^^^^^^^^^^^^^^^^^
```

```
  ButtonTextAlign (ImVec2)
    Alinhamento do texto dentro de botoes. (0.5, 0.5) = centralizado.
    Ex: style.ButtonTextAlign = ImVec2(0.5f, 0.5f);
```

# `SelectableTextAlign (ImVec2)` 

```
    Alinhamento do texto em Selectable.
```

```
    Ex: style.SelectableTextAlign = ImVec2(0.0f, 0.0f); // esquerda
```

# `DisplayWindowPadding (ImVec2)` 

```
    Padding extra para posicionamento de janelas (evita janelas fora da tela).
```

# `DisplaySafeAreaPadding (ImVec2)` 

```
    Padding de seguranca para renderizacao (notch, bordas arredondadas).
```

# `MouseCursorScale (float)` 

```
    Escala do cursor do mouse quando desenhado pela ImGui.
    Ex: style.MouseCursorScale = 1.0f;
```

# `Alpha (float)` 

```
    Opacidade global de toda a interface. 1.0 = opaco, 0.0 = invisivel.
    Ex: style.Alpha = 0.95f; // levemente transparente
```

# `AntiAliasedLines (bool)` 

```
    Habilita anti-aliasing em linhas.
```

# `AntiAliasedLinesUseTex (bool)` 

```
    Usa textura para anti-aliasing de linhas (mais rapido).
```

# `AntiAliasedFill (bool)` 

```
    Habilita anti-aliasing em preenchimentos.
```

# `CurveTessellationTol (float)` 

```
    Tolerancia de tesselacao de curvas (Bezier). Menor = mais suave.
    Ex: style.CurveTessellationTol = 1.25f;
```

# `CircleTessellationMaxError (float)` 

```
    Erro maximo de tesselacao de circulos.
    Ex: style.CircleTessellationMaxError = 0.30f;
```

- `8.4 - Indices ImGuiCol (Paleta de Cores)` 

```
------------------------------------------
```

```
O vetor Colors[ImGuiCol_COUNT] da ImGuiStyle contem todas as cores da
interface. Cada indice representa um elemento visual especifico.
```

```
Lista completa dos indices mais importantes:
```

|`INDICE`<br>`------------------------------`|`| ELEMENTO`<br>`------------------------------------------`|
|---|---|
|<br>`ImGuiCol_Text`|<br>`| Cor do texto padrao`|
|`ImGuiCol_TextDisabled`<br>|`| Cor do texto desabilitado`<br>|
|`ImGuiCol_WindowBg`<br>|`| Fundo da janela`<br>|
|`ImGuiCol_ChildBg`|`Fundo de child windows`|
|<br>`ImGuiCol_PopupBg`|<br>`| Fundo de popups (menus, tooltips, combos)`|
|`ImGuiCol_Border`<br>|`| Cor das bordas`<br>|
|`ImGuiColBorderShadow`|`Sombra das bordas`|
|`_`<br>`ImGuiCol_FrameBg`|<br>`Fundo de frames (botoes, inputs, sliders)`|
|<br>`ImGuiCol_FrameBgHovered`|<br>`| Frame com hover (mouse em cima)`|
|`ImGuiCol_FrameBgActive`<br>|`| Frame ativo (clicado)`<br>|
|`ImGuiColTitleBg`|`Fundo do titulo da janela (ativa)`|
|`_`<br>`ImGuiCol_TitleBgActive`|<br>`| Fundo do titulo (janela focada)`|
|<br>`ImGuiCol_TitleBgCollapsed`|<br>`| Fundo do titulo (janela colapsada)`|
|`ImGuiCol_MenuBarBg`<br>|`| Fundo da barra de menu`<br>|
|`ImGuiCol_ScrollbarBg`|`Fundo da scrollbar`|
|<br>`ImGuiCol_ScrollbarGrab`|<br>`| Alca da scrollbar`|
|<br>`ImGuiCol_ScrollbarGrabHovered`|<br>`| Alca com hover`|
|`ImGuiCol_ScrollbarGrabActive`<br>|`| Alca ativa (arrastando)`<br>|
|`ImGuiCol_CheckMark`|`Cor do checkmark (checkbox, radio, menu)`|
|<br>`ImGuiCol_SliderGrab`|<br>`| Alca do slider`|
|<br>`ImGuiCol_SliderGrabActive`|<br>`| Alca do slider ativa`|
|`ImGuiCol_Button`<br>|`| Fundo do botao (normal)`<br>|
|`ImGuiColButtonHovered`|`Botao com hover`|
|`_`<br>`ImGuiCol_ButtonActive`|<br>`| Botao clicado`|
|`ImGuiCol_Header`|`| Cabecalho (TreeNode, CollapsingHeader)`|
|`ImGuiColHeaderHovered`|`Cabecalho com hover`|
|`_`<br>`ImGuiCol_HeaderActive`|<br>`Cabecalho clicado`|
|<br>`ImGuiCol_Separator`|<br>`| Separador (Separator, bordas de tabela)`|
|`ImGuiCol_SeparatorHovered`|`| Separador com hover`|
|`ImGuiColSeparatorActive`|`Separador ativo (arrastando borda)`|
|`_`<br>`ImGuiCol_ResizeGrip`|<br>`| Alca de redimensionamento`|
|<br>`ImGuiCol_ResizeGripHovered`|<br>`| Alca com hover`|
|`ImGuiCol_ResizeGripActive`|`| Alca ativa`|
|`ImGuiColTab`|`Aba (fechada/nao selecionada)`|
|`_`<br>`ImGuiCol_TabHovered`|<br>`Aba com hover`|
|<br>`ImGuiCol_TabActive`|<br>`| Aba selecionada`|
|`ImGuiCol_TabUnfocused`|`| Aba sem foco`|
|`ImGuiCol_TabUnfocusedActive`<br>|`| Aba ativa sem foco`<br>|
|`ImGuiCol_DockingPreview`|`Preview de docking`|
|<br>`ImGuiCol_DockingEmptyBg`|<br>`| Fundo vazio do dockspace`|
|`ImGuiColPlotLines`|`Linhas do grafico (PlotLines)`|
|`_`<br>`ImGuiColPlotLinesHovered`|<br>`Linha com hover`|
|`_`<br>`ImGuiCol_PlotHistogram`|<br>`| Barras do histograma`|
|<br>`ImGuiCol_PlotHistogramHovered`|<br>`| Barra com hover`|
|`ImGuiCol_TableHeaderBg`<br>|`| Fundo do cabecalho de tabela`<br>|
|`ImGuiColTableBorderStrong`|`Borda forte de tabela`|
|`_`<br>`ImGuiCol_TableBorderLight`|<br>`| Borda leve de tabela`|
|<br>`ImGuiCol_TableRowBg`<br>`ImGuiColTableRowBgAlt`|<br>`| Fundo de linha de tabela (par)`<br>`Fundo de linha (impar alternada)`|
|`_`<br>`ImGuiColTextSelectedBg`|`,`<br>`Fundo de texto selecionado`|
|`_`<br>`ImGuiCol_DragDropTarget`|<br>`| Alvo de drag-and-drop`|
|`ImGuiCol_NavHighlight`|`| Highlight de navegacao por teclado`|
|`ImGuiColNavWindowingHighlight`|`Highlight de navegacao entre janelas`|
|`_`<br>`ImGuiColNavWindowingDimBg`|<br>`Fundo escurecido ao navegar janelas`|
|`_`<br>`ImGuiCol_ModalWindowDimBg`|<br>`| Fundo escurecido de janela modal`|



```
Total: 56 indices (no ImGui atual, o numero pode variar ligeiramente).
```

```
8.5 - Exemplo do Splinter theme.cpp:4-45 Explicado em Detalhe
---------------------------------------------------------------
O Splinter define seu tema em theme.cpp. Vamos analisar a implementacao:
```

```
  // File: splinter/src/theme/theme.cpp (linhas 4-45 aproximado)
```

```
  void apply_theme() {
      ImGuiStyle& style = ImGui::GetStyle();
      ImGuiIO& io = ImGui::GetIO();
```

```
      // --- Configurar estilo visual ---
      style.WindowPadding          = ImVec2(16, 16);
      style.WindowRounding         = 10.0f;
      style.WindowBorderSize       = 0.0f;
      style.FramePadding           = ImVec2(10, 8);
      style.FrameRounding          = 6.0f;
      style.FrameBorderSize       = 0.0f;
      style.ItemSpacing            = ImVec2(12, 8);
      style.ItemInnerSpacing       = ImVec2(8, 6);
      style.IndentSpacing          = 24.0f;
      style.ScrollbarSize          = 12.0f;
      style.ScrollbarRounding      = 6.0f;
      style.GrabMinSize            = 8.0f;
      style.GrabRounding           = 4.0f;
      style.TabRounding            = 6.0f;
      style.TabBorderSize          = 0.0f;
      style.TabBarBorderSize       = 0.0f;
      style.ChildRounding          = 8.0f;
      style.PopupRounding          = 8.0f;
      style.Alpha                  = 1.0f;
```

```
      // --- Configurar cores (tema escuro com accent azul) ---
      ImVec4 accent     = ImVec4(0.29f, 0.62f, 1.00f, 1.00f); // #4A9EFF
      ImVec4 accent_hov = ImVec4(0.40f, 0.70f, 1.00f, 1.00f);
      ImVec4 accent_act = ImVec4(0.20f, 0.50f, 0.90f, 1.00f);
      ImVec4 bg_dark    = ImVec4(0.08f, 0.08f, 0.10f, 1.00f); // #141416
      ImVec4 bg_mid     = ImVec4(0.12f, 0.12f, 0.15f, 1.00f); // #1F1F26
      ImVec4 bg_light   = ImVec4(0.16f, 0.16f, 0.20f, 1.00f); // #292933
      ImVec4 text       = ImVec4(0.92f, 0.92f, 0.94f, 1.00f); // #EBEBF0
      ImVec4 text_dis   = ImVec4(0.50f, 0.50f, 0.55f, 1.00f); // #80808C
```

```
      // Aplicar cores
      style.Colors[ImGuiCol_Text]                 = text;
      style.Colors[ImGuiCol_TextDisabled]         = text_dis;
      style.Colors[ImGuiCol_WindowBg]             = bg_dark;
      style.Colors[ImGuiCol_ChildBg]              = bg_mid;
      style.Colors[ImGuiCol_PopupBg]              = bg_mid;
      style.Colors[ImGuiCol_Border]               = ImVec4(0.20f, 0.20f, 0.25f,
1.00f);
```

```
      style.Colors[ImGuiCol_FrameBg]              = bg_light;
      style.Colors[ImGuiCol_FrameBgHovered]       = ImVec4(0.22f, 0.22f, 0.28f,
1.00f);
      style.Colors[ImGuiCol_FrameBgActive]        = ImVec4(0.26f, 0.26f, 0.32f,
1.00f);
      style.Colors[ImGuiCol_TitleBg]              = bg_mid;
      style.Colors[ImGuiCol_TitleBgActive]        = bg_dark;
      style.Colors[ImGuiCol_TitleBgCollapsed]     = bg_mid;
      style.Colors[ImGuiCol_MenuBarBg]            = bg_mid;
      style.Colors[ImGuiCol_ScrollbarBg]          = bg_mid;
      style.Colors[ImGuiCol_ScrollbarGrab]        = accent;
```

```
      style.Colors[ImGuiCol_ScrollbarGrabHovered] = accent_hov;
      style.Colors[ImGuiCol_ScrollbarGrabActive]  = accent_act;
      style.Colors[ImGuiCol_CheckMark]            = accent;
      style.Colors[ImGuiCol_SliderGrab]           = accent;
      style.Colors[ImGuiCol_SliderGrabActive]     = accent_act;
      style.Colors[ImGuiCol_Button]               = accent;
      style.Colors[ImGuiCol_ButtonHovered]        = accent_hov;
      style.Colors[ImGuiCol_ButtonActive]         = accent_act;
      style.Colors[ImGuiCol_Header]               = ImVec4(0.20f, 0.20f, 0.25f,
1.00f);
      style.Colors[ImGuiCol_HeaderHovered]        = accent;
      style.Colors[ImGuiCol_HeaderActive]         = accent_act;
      style.Colors[ImGuiCol_Separator]            = ImVec4(0.20f, 0.20f, 0.25f,
1.00f);
      style.Colors[ImGuiCol_ResizeGrip]           = accent;
      style.Colors[ImGuiCol_ResizeGripHovered]    = accent_hov;
      style.Colors[ImGuiCol_ResizeGripActive]     = accent_act;
      style.Colors[ImGuiCol_Tab]                  = bg_mid;
      style.Colors[ImGuiCol_TabHovered]           = accent;
      style.Colors[ImGuiCol_TabActive]            = accent;
      style.Colors[ImGuiCol_TabUnfocused]         = bg_mid;
      style.Colors[ImGuiCol_TabUnfocusedActive]   = accent;
      style.Colors[ImGuiCol_PlotLines]            = accent;
      style.Colors[ImGuiCol_PlotHistogram]        = accent;
      style.Colors[ImGuiCol_TableHeaderBg]        = bg_mid;
      style.Colors[ImGuiCol_TableBorderStrong]    = ImVec4(0.25f, 0.25f, 0.30f,
1.00f);
      style.Colors[ImGuiCol_TableBorderLight]     = ImVec4(0.18f, 0.18f, 0.22f,
1.00f);
      style.Colors[ImGuiCol_TableRowBg]           = ImVec4(0.10f, 0.10f, 0.12f,
1.00f);
      style.Colors[ImGuiCol_TableRowBgAlt]        = ImVec4(0.14f, 0.14f, 0.17f,
1.00f);
      style.Colors[ImGuiCol_TextSelectedBg]       = ImVec4(0.29f, 0.62f, 1.00f,
0.30f);
```

```
      style.Colors[ImGuiCol_NavHighlight]         = accent;
```

```
      style.Colors[ImGuiCol_ModalWindowDimBg]     = ImVec4(0.02f, 0.02f, 0.04f,
0.60f);
```

```
      // --- Configurar cursors do mouse (opcional) ---
      // ...
  }
```

```
Explicacao detalhada:
```

```
  Linha 4-5: Obtem as referencias para ImGuiStyle e ImGuiIO.
```

```
  Linha 8-23: Configuracao de estilo visual (espacamentos, roundings, etc.):
    - WindowPadding = (16, 16): espaco interno generoso nas janelas
    - WindowRounding = 10: cantos bem arredondados (visual moderno)
    - WindowBorderSize = 0: sem borda de janela (flat design)
```

```
    - FramePadding = (10, 8): botoes mais altos e largos (facil de clicar)
    - FrameRounding = 6: cantos dos botoes arredondados
    - FrameBorderSize = 0: botoes sem borda
    - ItemSpacing = (12, 8): mais espaco entre widgets
    - ItemInnerSpacing = (8, 6): espaco interno confortavel
    - IndentSpacing = 24: indentacao padrao
```

```
    - ScrollbarSize = 12: scrollbar nem muito grossa nem muito fina
    - ScrollbarRounding = 6: scrollbar arredondada
    - GrabMinSize = 8: alca de slider pequena
    - GrabRounding = 4: levemente arredondada
    - TabRounding = 6: abas arredondadas
    - TabBorderSize = 0: abas sem borda
    - TabBarBorderSize = 0: barra de abas sem borda
```

- `ChildRounding = 8: child windows arredondadas` 

- `PopupRounding = 8: popups arredondados` 

- `Alpha = 1.0: totalmente opaco` 

```
  Linha 26-28: Define a cor de destaque (accent) em 3 variantes:
```

- `accent: cor normal (#4A9EFF, azul medio)` 

- `accent_hov: cor com hover (mais clara)` 

- `accent_act: cor ativa (mais escura)` 

```
  Linha 30-32: Cores de fundo em 3 niveis:
```

- `bg_dark: fundo escuro (#141416) para janelas` 

- `bg_mid: fundo medio (#1F1F26) para childs, popups, headers` 

- `bg_light: fundo claro (#292933) para frames (botoes, inputs)` 

```
  Linha 34-35: Cores de texto:
```

- `text: texto claro (#EBEBF0)` 

- `text_dis: texto desabilitado (#80808C)` 

```
  Linha 38-76: Aplicacao das cores. Destaques:
```

- `WindowBg usa bg_dark (fundo mais escuro)` 

- `FrameBg usa bg_light (destaque sutil dentro da janela)` 

- `Button usa accent (botoes coloridos com a cor de destaque)` 

- `ScrollbarGrab usa accent (scrollbar visivel)` 

- `TabActive usa accent (aba ativa destacada)` 

- `HeaderHovered usa accent (item de lista destacado ao passar mouse)` 

- `TextSelectedBg usa accent com 30% alpha` 

- `8.6 - Manipulacao de Cores em Tempo Real` 

```
-------------------------------------------
```

```
O Splinter permite mudar a cor de accent em tempo real:
```

```
  void set_accent_color(const ImVec4& new_accent) {
      ImGuiStyle& style = ImGui::GetStyle();
```

```
      style.Colors[ImGuiCol_Button]          = new_accent;
      style.Colors[ImGuiCol_CheckMark]       = new_accent;
      style.Colors[ImGuiCol_SliderGrab]      = new_accent;
      style.Colors[ImGuiCol_ScrollbarGrab]   = new_accent;
      style.Colors[ImGuiCol_ResizeGrip]      = new_accent;
      style.Colors[ImGuiCol_TabActive]       = new_accent;
      style.Colors[ImGuiCol_NavHighlight]    = new_accent;
      style.Colors[ImGuiCol_PlotLines]       = new_accent;
      style.Colors[ImGuiCol_PlotHistogram]   = new_accent;
      // Calcular variantes hover e active automaticamente
      ImVec4 hov(new_accent.x + 0.1f, new_accent.y + 0.1f,
                 new_accent.z + 0.1f, 1.0f);
      ImVec4 act(new_accent.x - 0.1f, new_accent.y - 0.1f,
                 new_accent.z - 0.1f, 1.0f);
      style.Colors[ImGuiCol_ButtonHovered]       = hov;
      style.Colors[ImGuiCol_ButtonActive]        = act;
      style.Colors[ImGuiCol_SliderGrabActive]    = act;
      style.Colors[ImGuiCol_ScrollbarGrabHovered]= hov;
      style.Colors[ImGuiCol_ScrollbarGrabActive] = act;
  }
```

# `8.7 - PushStyleVar e PushStyleColor` 

```
-------------------------------------
```

```
Permitem modificar estilo/cores temporariamente (para um widget especifico):
```

```
  // PushStyleVar modifica um campo de estilo
  ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(20, 15));
  ImGui::PushStyleVar(ImGuiStyleVar_FrameRounding, 12.0f);
```

```
  ImGui::Button("Botao Grande e Arredondado");
  ImGui::PopStyleVar(2);
```

```
  // PushStyleColor modifica uma cor
  ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(1, 0, 0, 1));  // Vermelho
  ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ImVec4(0.8f, 0, 0, 1));
  ImGui::Button("Botao Vermelho");
  ImGui::PopStyleColor(2);
```

```
Indices disponiveis para PushStyleVar:
  ImGuiStyleVar_Alpha
  ImGuiStyleVar_WindowPadding
  ImGuiStyleVar_WindowRounding
  ImGuiStyleVar_WindowBorderSize
  ImGuiStyleVar_WindowMinSize
  ImGuiStyleVar_ChildRounding
  ImGuiStyleVar_ChildBorderSize
  ImGuiStyleVar_PopupRounding
  ImGuiStyleVar_PopupBorderSize
  ImGuiStyleVar_FramePadding
  ImGuiStyleVar_FrameRounding
  ImGuiStyleVar_FrameBorderSize
  ImGuiStyleVar_ItemSpacing
  ImGuiStyleVar_ItemInnerSpacing
  ImGuiStyleVar_IndentSpacing
  ImGuiStyleVar_CellPadding
  ImGuiStyleVar_ScrollbarSize
  ImGuiStyleVar_ScrollbarRounding
  ImGuiStyleVar_GrabMinSize
  ImGuiStyleVar_GrabRounding
  ImGuiStyleVar_TabRounding
  ImGuiStyleVar_TabBorderSize
  ImGuiStyleVar_TabBarBorderSize
  ImGuiStyleVar_ButtonTextAlign
  ImGuiStyleVar_SelectableTextAlign
  ImGuiStyleVar_SeparatorTextBorderSize
  ImGuiStyleVar_SeparatorTextAlign
  ImGuiStyleVar_SeparatorTextPadding
```

# `8.8 - Dicas de Tema` 

```
--------------------
```

`1. Tema escuro vs claro: Comece com tema escuro (mais moderno, menos cansativo)` 

`2. Use uma unica cor de destaque (accent): define a personalidade do tema` 

`3. Cores de fundo em 3 niveis: mais escuro (janela), medio (child), claro (frame)` 

`4. Rounding moderado (4-10): visual moderno sem exageros` 

`5. WindowBorderSize = 0: elimina bordas para um visual mais limpo` 

`6. Scrollbar fina e com cor de accent: elegante e nao intrusiva` 

`7. Teste as cores em diferentes monitores (calibracao varia)` 

# `8.9 - Resumo do Capitulo` 

```
-------------------------
```

- `ImGuiStyle define a aparencia visual completa (espacamentos, roundings, cores)` 

- `Acessado via ImGui::GetStyle()` 

- `137+ indices de cor (ImGuiCol) no vetor Colors[]` 

- `O Splinter usa tema escuro com accent azul (#4A9EFF)` 

- `PushStyleVar e PushStyleColor para variacoes temporarias` 

- `O tema pode ser alterado em tempo real (accent color, etc.)` 

```
================================================================================
CAPITULO 9: BACKENDS (WIN32, DIRECTX 11)
```

```
================================================================================
```

```
9.1 - O que sao Backends?
```

```
---------------------------
```

```
Backends sao camadas de software que conectam a Dear ImGui ao sistema
operacional e a API grafica. Existem dois tipos:
```

`1. Backend de PLATAFORMA: fornece entrada (mouse, teclado, gamepad) e gerenciamento de janelas. Ex: Win32, GLFW, SDL2.` 

`2. Backend de RENDERIZACAO: desenha os comandos ImGui na tela usando uma API grafica. Ex: DirectX 11, OpenGL 3, Vulkan, Metal.` 

- `A separacao em dois backends permite qualquer combinacao. Por exemplo: - Win32 + DirectX 11 (Splinter)` 

- `GLFW + OpenGL 3` 

- `SDL2 + Vulkan - Win32 + OpenGL 3` 

- `9.2 - Arquitetura dos Backends` 

```
-------------------------------
```

```
  +-----------------------------+
  |        APLICACAO            |
  |   (Splinter main.cpp)       |
  +--------+----------+--------+
           |          |
           v          v
  +--------+--+  +----+--------+
  | Platform  |  |  Renderer   |
  | Backend   |  |  Backend    |
  | Win32     |  |  DX11       |
  +--------+--+  +----+--------+
           |          |
           v          v
  +--------+--+  +----+--------+
  |  Windows  |  |  DirectX 11 |
  |  (User32) |  |  (D3D11)    |
  +-----------+  +-------------+
Cada backend fornece 4 funcoes principais:
  - Init: inicializa o backend
  - NewFrame: prepara o backend para um novo frame
  - (Plataforma) WndProcHandler: processa mensagens do SO
  - (Render) RenderDrawData: desenha os comandos na GPU
  - Shutdown: libera recursos
```

```
9.3 - Backend Win32 Detalhado (imgui_impl_win32.cpp)
------------------------------------------------------
```

```
9.3.1 - Inicializacao (ImGui_ImplWin32_Init)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  bool ImGui_ImplWin32_Init(void* hwnd) {
      // 1. Verificar se ja foi inicializado
      ImGuiIO& io = ImGui::GetIO();
      IM_ASSERT(io.BackendPlatformUserData == NULL &&
                "Already initialized a platform backend!");
```

```
      // 2. Armazenar handle da janela
      ImGui_ImplWin32_Data* bd = IM_NEW(ImGui_ImplWin32_Data)();
      bd->hwnd = (HWND)hwnd;
```

```
      // 3. Registrar o WndProcHandler (subclasse a WndProc)
      ImGui_ImplWin32_WndProcHandler(hwnd, ...);
```

```
      // 4. Configurar IO
      io.BackendPlatformName = "imgui_impl_win32";
      io.BackendFlags |= ImGuiBackendFlags_HasMouseCursors;
      io.BackendFlags |= ImGuiBackendFlags_HasSetMousePos;
      io.BackendFlags |= ImGuiBackendFlags_PlatformHasViewports;
      // 5. Inicializar gamepad (XInput)
      // ...
      return true;
  }
```

```
9.3.2 - NewFrame (ImGui_ImplWin32_NewFrame)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  void ImGui_ImplWin32_NewFrame() {
      ImGuiIO& io = ImGui::GetIO();
      ImGui_ImplWin32_Data* bd = ...;
      // 1. Atualizar DisplaySize (se nao foi feito via WM_SIZE)
      RECT rect;
      GetClientRect(bd->hwnd, &rect);
      io.DisplaySize.x = (float)(rect.right - rect.left);
      io.DisplaySize.y = (float)(rect.bottom - rect.top);
      // 2. Calcular DeltaTime
      LARGE_INTEGER now;
      QueryPerformanceCounter(&now);
      io.DeltaTime = (float)(now.QuadPart - bd->Time.QuadPart) /
                     (float)bd->TicksPerSecond.QuadPart;
      bd->Time = now;
      // 3. Atualizar estado dos modificadores (Ctrl, Shift, Alt, Super)
      io.KeyCtrl  = (GetKeyState(VK_CONTROL) & 0x8000) != 0;
      io.KeyShift = (GetKeyState(VK_SHIFT)   & 0x8000) != 0;
      io.KeyAlt   = (GetKeyState(VK_MENU)    & 0x8000) != 0;
      io.KeySuper = (GetKeyState(VK_LWIN)    & 0x8000) != 0;
      // 4. Atualizar mouse (capturar posicao)
      if (bd->WantUpdateMousePos && !io.WantSetMousePos) {
          POINT mouse_pos;
          GetCursorPos(&mouse_pos);
          ScreenToClient(bd->hwnd, &mouse_pos);
          io.MousePos.x = (float)mouse_pos.x;
          io.MousePos.y = (float)mouse_pos.y;
      }
      // 5. Atualizar gamepad (se habilitado)
      // ...
  }
```

```
9.3.3 - WndProcHandler (Mensagens Tratadas)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  // Mensagens tratadas (ja detalhado no Capitulo 7):
  WM_MOUSEMOVE       -> io.MousePos
  WM_LBUTTONDOWN/UP  -> io.MouseDown[0]
  WM_RBUTTONDOWN/UP  -> io.MouseDown[1]
  WM_MBUTTONDOWN/UP  -> io.MouseDown[2]
  WM_XBUTTONDOWN/UP  -> io.MouseDown[3], io.MouseDown[4]
  WM_MOUSEWHEEL      -> io.MouseWheel
  WM_MOUSEHWHEEL     -> io.MouseWheelH
```

```
  WM_KEYDOWN/UP      -> io.KeysDown[]
  WM_SYSKEYDOWN/UP   -> io.KeysDown[]
  WM_CHAR            -> io.AddInputCharacter()
  WM_SETFOCUS        -> (restaura estado)
  WM_KILLFOCUS       -> io.ClearInputKeys()
  WM_SETCURSOR       -> (gerencia cursor)
  WM_DEVICECHANGE    -> (gamepad)
  WM_INPUTLANGCHANGE -> (IME)
```

```
  NOTA: O WndProcHandler NAO trata WM_SIZE, WM_PAINT, WM_DESTROY, WM_NCHITTEST,
  WM_ERASEBKGND, etc. Essas mensagens devem ser tratadas pelo WndProc da
  aplicacao.
```

```
9.4 - Backend DX11 Detalhado (imgui_impl_dx11.cpp)
```

```
-----------------------------------------------------
```

```
9.4.1 - Inicializacao (ImGui_ImplDX11_Init)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  bool ImGui_ImplDX11_Init(ID3D11Device* device,
                            ID3D11DeviceContext* device_context) {
      ImGuiIO& io = ImGui::GetIO();
```

```
      // 1. Armazenar device e context
      ImGui_ImplDX11_Data* bd = IM_NEW(ImGui_ImplDX11_Data)();
      bd->pd3dDevice = device;
      bd->pd3dDeviceContext = device_context;
      device->AddRef();
      device_context->AddRef();
```

```
      // 2. Configurar IO
      io.BackendRendererName = "imgui_impl_dx11";
      io.BackendFlags |= ImGuiBackendFlags_RendererHasVtxOffset;
```

```
      // 3. Criar shaders e input layout
      create_shaders(bd);
```

```
      // 4. Criar font texture
      ImGui_ImplDX11_CreateDeviceObjects();
```

```
      return true;
  }
```

```
9.4.2 - NewFrame (ImGui_ImplDX11_NewFrame)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  void ImGui_ImplDX11_NewFrame() {
      ImGui_ImplDX11_Data* bd = ...;
```

```
      // Nao faz muito - apenas prepara para o novo frame.
```

```
      // A maior parte da logica esta em RenderDrawData.
```

```
      if (!bd->FontTexture)
          ImGui_ImplDX11_CreateDeviceObjects();
  }
```

```
9.4.3 - RenderDrawData (ImGui_ImplDX11_RenderDrawData)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  void ImGui_ImplDX11_RenderDrawData(ImDrawData* draw_data) {
      // 1. Evitar renderizar se vazio
      if (draw_data->CmdListsCount == 0) return;
```

```
      ImGui_ImplDX11_Data* bd = ...;
```

```
      ID3D11DeviceContext* ctx = bd->pd3dDeviceContext;
```

```
      // 2. Calcular tamanho do vertex/index buffer necessario
      size_t vertex_size = draw_data->TotalVtxCount * sizeof(ImDrawVert);
      size_t index_size = draw_data->TotalIdxCount * sizeof(ImDrawIdx);
```

```
      // 3. Criar/redimensionar vertex buffer
      if (!bd->VertexBuffer || bd->VertexBufferSize < vertex_size) {
          if (bd->VertexBuffer) { bd->VertexBuffer->Release(); }
          D3D11_BUFFER_DESC desc = {};
          desc.Usage = D3D11_USAGE_DYNAMIC;
          desc.ByteWidth = (UINT)vertex_size;
          desc.BindFlags = D3D11_BIND_VERTEX_BUFFER;
          desc.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
          device->CreateBuffer(&desc, NULL, &bd->VertexBuffer);
          bd->VertexBufferSize = vertex_size;
      }
      // 4. Criar/redimensionar index buffer (similar)
      // ...
```

```
      // 5. Mapear buffers e copiar vertices/indices
      D3D11_MAPPED_SUBRESOURCE vtx_res, idx_res;
      ctx->Map(bd->VertexBuffer, 0, D3D11_MAP_WRITE_DISCARD, 0, &vtx_res);
      ctx->Map(bd->IndexBuffer, 0, D3D11_MAP_WRITE_DISCARD, 0, &idx_res);
```

```
      ImDrawVert* vtx_dst = (ImDrawVert*)vtx_res.pData;
      ImDrawIdx* idx_dst = (ImDrawIdx*)idx_res.pData;
```

```
      for (int n = 0; n < draw_data->CmdListsCount; n++) {
          const ImDrawList* cmd_list = draw_data->CmdLists[n];
          memcpy(vtx_dst, cmd_list->VtxBuffer.Data,
                 cmd_list->VtxBuffer.Size * sizeof(ImDrawVert));
          memcpy(idx_dst, cmd_list->IdxBuffer.Data,
                 cmd_list->IdxBuffer.Size * sizeof(ImDrawIdx));
          vtx_dst += cmd_list->VtxBuffer.Size;
          idx_dst += cmd_list->IdxBuffer.Size;
      }
      ctx->Unmap(bd->VertexBuffer, 0);
      ctx->Unmap(bd->IndexBuffer, 0);
      // 6. Setup pipeline state
      UINT stride = sizeof(ImDrawVert);
      UINT offset = 0;
      ctx->IASetInputLayout(bd->InputLayout);
      ctx->IASetVertexBuffers(0, 1, &bd->VertexBuffer, &stride, &offset);
      ctx->IASetIndexBuffer(bd->IndexBuffer, DXGI_FORMAT_R16_UINT, 0);
      ctx->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
      ctx->VSSetShader(bd->VertexShader, NULL, 0);
      ctx->PSSetShader(bd->PixelShader, NULL, 0);
      ctx->PSSetSamplers(0, 1, &bd->FontSampler);
      // 7. Setup blend state (alpha blending)
      ctx->OMSetBlendState(bd->BlendState, NULL, 0xFFFFFFFF);
      ctx->OMSetDepthStencilState(bd->DepthStencilState, 0);
      ctx->RSSetState(bd->RasterizerState);
      // 8. Calcular matriz de projecao (ortografica)
      float L = draw_data->DisplayPos.x;
      float R = draw_data->DisplayPos.x + draw_data->DisplaySize.x;
      float T = draw_data->DisplayPos.y;
      float B = draw_data->DisplayPos.y + draw_data->DisplaySize.y;
```

```
      // Enviar constante buffer com a matriz de projecao
      // ...
      // 9. Loop sobre draw lists e comandos
      int global_vtx_offset = 0;
      int global_idx_offset = 0;
      for (int n = 0; n < draw_data->CmdListsCount; n++) {
          const ImDrawList* cmd_list = draw_data->CmdLists[n];
          for (int cmd_i = 0; cmd_i < cmd_list->CmdBuffer.Size; cmd_i++) {
              const ImDrawCmd* pcmd = &cmd_list->CmdBuffer[cmd_i];
              // 10. Aplicar clipping (scissor rect)
              RECT r;
              r.left   = (LONG)(pcmd->ClipRect.x - L);
              r.top    = (LONG)(pcmd->ClipRect.y - T);
              r.right  = (LONG)(pcmd->ClipRect.z - L);
              r.bottom = (LONG)(pcmd->ClipRect.w - T);
              ctx->RSSetScissorRects(1, &r);
              // 11. Aplicar textura (font atlas)
              ID3D11ShaderResourceView* texture =
                  (ID3D11ShaderResourceView*)pcmd->TextureId;
              ctx->PSSetShaderResources(0, 1, &texture);
              // 12. Verificar callback customizado
              if (pcmd->UserCallback) {
                  pcmd->UserCallback(cmd_list, pcmd);
              } else {
                  // 13. DrawIndexed
                  ctx->DrawIndexed(pcmd->ElemCount,
                                   pcmd->IdxOffset + global_idx_offset,
                                   pcmd->VtxOffset + global_vtx_offset);
              }
          }
          global_vtx_offset += cmd_list->VtxBuffer.Size;
          global_idx_offset += cmd_list->IdxBuffer.Size;
      }
  }
```

```
9.4.4 - Shutdown (ImGui_ImplDX11_Shutdown)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  void ImGui_ImplDX11_Shutdown() {
      ImGui_ImplDX11_Data* bd = ...;
```

```
      if (bd->VertexBuffer)       bd->VertexBuffer->Release();
      if (bd->IndexBuffer)        bd->IndexBuffer->Release();
      if (bd->FontTexture)        bd->FontTexture->Release();
      if (bd->VertexShader)       bd->VertexShader->Release();
      if (bd->PixelShader)        bd->PixelShader->Release();
      if (bd->InputLayout)        bd->InputLayout->Release();
      if (bd->BlendState)         bd->BlendState->Release();
      if (bd->RasterizerState)    bd->RasterizerState->Release();
      if (bd->DepthStencilState)  bd->DepthStencilState->Release();
      if (bd->FontSampler)        bd->FontSampler->Release();
```

```
      bd->pd3dDevice->Release();
      bd->pd3dDeviceContext->Release();
```

```
      ImGui::GetIO().BackendRendererName = NULL;
      ImGui::GetIO().BackendRendererUserData = NULL;
  }
```

```
9.5 - Criacao do Device e Swap Chain DX11 no Splinter (dx11.cpp:12-53)
----------------------------------------------------------------------
O Splinter nao usa o backend DX11 padrao para criar o device - ele faz a
criacao manualmente para ter controle total da swap chain (especialmente
para usar DComp - Desktop Compositor). Vamos analisar:
```

```
  // File: splinter/src/dx11.cpp (linhas 12-53 aproximado)
```

```
  // Variaveis globais do DX11
  ID3D11Device*           g_pd3dDevice = NULL;
  ID3D11DeviceContext*    g_pd3dDeviceContext = NULL;
  IDXGISwapChain1*        g_pSwapChain = NULL;
  ID3D11RenderTargetView* g_mainRenderTargetView = NULL;
```

```
  bool create_device_d3d(HWND hwnd)
  {
      // --- Etapa 1: Criar Device e Context ---
      D3D_FEATURE_LEVEL feature_level;
      const D3D_FEATURE_LEVEL feature_level_array[2] = {
          D3D_FEATURE_LEVEL_11_0,
          D3D_FEATURE_LEVEL_10_0,
      };
      HRESULT hr = D3D11CreateDevice(
          NULL,                         // Adaptador padrao
          D3D_DRIVER_TYPE_HARDWARE,     // Usar GPU dedicada
          NULL,                         // Sem software rasterizer
          D3D11_CREATE_DEVICE_BGRA_SUPPORT, // BGRA support (para DComp)
          feature_level_array,          // Feature levels suportados
          2,                            // Numero de feature levels
          D3D11_SDK_VERSION,            // SDK version
          &g_pd3dDevice,               // Device criado
          &feature_level,              // Feature level obtido
          &g_pd3dDeviceContext         // Context criado
```

```
      );
```

```
      if (FAILED(hr)) return false;
      // --- Etapa 2: Criar IDXGIFactory2 para swap chain ---
      IDXGIDevice1* dxgi_device = NULL;
      IDXGIAdapter* dxgi_adapter = NULL;
      IDXGIFactory2* dxgi_factory = NULL;
```

```
      g_pd3dDevice->QueryInterface(IID_PPV_ARGS(&dxgi_device));
      dxgi_device->GetAdapter(&dxgi_adapter);
      dxgi_adapter->GetParent(IID_PPV_ARGS(&dxgi_factory));
      // --- Etapa 3: Preencher descricao da swap chain ---
      DXGI_SWAP_CHAIN_DESC1 sc_desc = {};
      sc_desc.Width              = 0;   // Auto (tamanho da janela)
      sc_desc.Height             = 0;   // Auto
      sc_desc.Format             = DXGI_FORMAT_B8G8R8A8_UNORM;
      sc_desc.Stereo             = FALSE;
      sc_desc.SampleDesc.Count   = 1;   // Sem MSAA
      sc_desc.SampleDesc.Quality = 0;
      sc_desc.BufferUsage        = DXGI_USAGE_RENDER_TARGET_OUTPUT;
      sc_desc.BufferCount        = 2;   // Double buffering
      sc_desc.Scaling            = DXGI_SCALING_STRETCH;
      sc_desc.SwapEffect         = DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL;
```

```
      sc_desc.AlphaMode          = DXGI_ALPHA_MODE_PREMULTIPLIED;
      sc_desc.Flags              = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH;
```

```
      // --- Etapa 4: Criar swap chain com DComp ---
      hr = dxgi_factory->CreateSwapChainForComposition(
          g_pd3dDevice,
          &sc_desc,
          NULL,                     // Nao usa output window
          &g_pSwapChain
      );
```

```
      // --- Etapa 5: Criar Render Target View ---
      create_render_target();
```

```
      // Liberar interfaces temporarias
      dxgi_device->Release();
      dxgi_adapter->Release();
      dxgi_factory->Release();
```

```
      return SUCCEEDED(hr);
  }
```

```
9.5.1 - Explicacao da Configuracao da Swap Chain (dx11.cpp:28-37)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
  sc_desc.BufferCount = 2;
```

- `// Double buffering (2 buffers: front + back). O backbuffer e desenhado // enquanto o frontbuffer e exibido. No Present, os buffers trocam.` 

- `// Valor 2 = minimo necessario para double buffer. 3 = triple buffer.` 

```
  sc_desc.SwapEffect = DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL;
```

- `// Flip Sequential: modo moderno de swap effect (Windows 8+).` 

- `// Diferente do DXGI_SWAP_EFFECT_DISCARD (legado), o Flip Sequential // preserva o conteudo dos buffers e permite que o DWM (Desktop Window // Manager) componha a janela de forma mais eficiente. // Vantagens: menor lag, menos tearing, melhor integracao com DWM.` 

```
  sc_desc.AlphaMode = DXGI_ALPHA_MODE_PREMULTIPLIED;
```

- `// Alpha premultiplicado: necessario para transparencia na janela` 

- `// (efeito acrylic/glass). Com este modo, o DWM compoe a janela // corretamente com o fundo da area de trabalho. // Sem isso, a janela nao teria transparencia.` 

```
  sc_desc.Format = DXGI_FORMAT_B8G8R8A8_UNORM;
```

- `// Formato 32-bit BGRA. B8G8R8A8 e o formato mais comum e suportado // por todas as GPUs modernas. O UNORM significa que cada canal e // um valor de 0 a 255 mapeado para 0.0 a 1.0 no shader.` 

- `// CreateSwapChainForComposition:` 

- `// Variante especial de criacao de swap chain para uso com DComp // (Desktop Compositor). Permite que a janela seja composta como // uma textura pelo DWM, possibilitando efeitos como acrylic, // transparencia, e animacoes via Windows.UI.Composition.` 

- `// Diferente de CreateSwapChainForHwnd (swap chain tradicional), // esta funcao cria uma swap chain que NAO esta diretamente ligada // a uma HWND, mas sim a um visual do DComp.` 

```
9.6 - Vertex Shader e Pixel Shader da ImGui
```

```
---------------------------------------------
A ImGui usa shaders muito simples compilados em tempo de compilacao
(via D3DCompile ou diretamente com codigo binario pre-compilado).
```

```
Vertex Shader (imguivs.hlsl):
  struct VS_INPUT {
```

```
      float2 pos : POSITION;
      float2 uv  : TEXCOORD0;
      float4 col : COLOR0;
  };
  struct PS_INPUT {
      float4 pos : SV_POSITION;
      float2 uv  : TEXCOORD0;
      float4 col : COLOR0;
  };
  cbuffer vertexBuffer : register(b0) {
      float4x4 ProjectionMatrix;
  };
  PS_INPUT main(VS_INPUT input) {
      PS_INPUT output;
      output.pos = mul(float4(input.pos.xy, 0.f, 1.f), ProjectionMatrix);
      output.uv  = input.uv;
      output.col = input.col;
      return output;
  }
Pixel Shader (imgui_ps.hlsl):
  struct PS_INPUT {
      float4 pos : SV_POSITION;
      float2 uv  : TEXCOORD0;
      float4 col : COLOR0;
  };
  sampler sampler0 : register(s0);
  Texture2D texture0 : register(t0);
  float4 main(PS_INPUT input) : SV_Target {
      return input.col * texture0.Sample(sampler0, input.uv);
  }
```

```
O pixel shader simplesmente multiplica a cor do vertice pela amostra da
textura (font atlas). Isso permite que o texto e os elementos sejam
coloridos dinamicamente.
```

- `9.7 - Resumo do Capitulo` 

- `------------------------- Backends conectam a ImGui ao SO (plataforma) e a GPU (renderizacao) - Backend Win32: Init, WndProcHandler (mensagens WM_*), NewFrame, Shutdown - Backend DX11: Init (cria shaders, input layout), NewFrame, RenderDrawData (mapeia buffers, aplica clipping, emite DrawIndexed), Shutdown` 

- `RenderDrawData faz: mapear buffers -> copiar vertices/indices -> setup pipeline -> loop cmd lists com RSSetScissorRect + PSSetShaderResources + DrawIndexed` 

- `Splinter cria device DX11 manualmente com CreateSwapChainForComposition para suporte a DComp e efeito acrylic` 

- `Swap chain config: FlipSequential, PremultipliedAlpha, BufferCount=2` 

- `Shaders sao simples: VS transforma vertices, PS multiplica cor x textura` 

```
================================================================================
CAPITULO 10: CICLO COMPLETO DE RENDERIZACAO
================================================================================
```

```
10.1 - Visao Geral
```

```
-------------------
O ciclo completo de renderizacao da Dear ImGui ocorre a cada frame e segue
uma sequencia bem definida de 5 etapas:
```

```
  [1. NewFrame]
        |
        v
```

```
  [2. Widgets (Construir Interface)]
        |
        v
  [3. Render (fechar frame)]
        |
        v
```

```
  [4. Backend Desenha (RenderDrawData)]
        |
        v
```

```
  [5. Present (Apresentar)]
```

```
Cada etapa chama funcoes especificas, tanto da biblioteca ImGui quanto dos
backends.
```

```
10.2 - Diagrama Completo do Frame
```

```
-----------------------------------
```

```
  INICIO DO FRAME
       |
       v
  +-----------------------------+
  | 1. NEWFRAME                 |
  |                             |
  | a) ImGui_ImplDX11_NewFrame |
  | b) ImGui_ImplWin32_NewFrame|
  | c) ImGui::NewFrame()       |
  +-----------------------------+
       |
       v
  +-----------------------------+
  | 2. WIDGETS                  |
  |                             |
  | gui.cpp: render_gui()       |
  |   - Begin/End janelas       |
  |   - Botoes, sliders, inputs |
  |   - Abas, search, etc.     |
  |   - ImDrawList::Add*()      |
  +-----------------------------+
       |
       v
  +-----------------------------+
  | 3. RENDER / END_FRAME       |
  |                             |
  | a) ImGui::Render()          |
  | b) Clear backbuffer         |
  | c) ImGui_ImplDX11_Render-   |
  |    DrawData(draw_data)      |
  +-----------------------------+
       |
       v
  +-----------------------------+
  | 4. BACKEND DESENHA          |
  |                             |
  | RenderDrawData interno:     |
  |   - Mapeia buffers          |
  |   - Copia vertices/indices  |
  |   - Setup pipeline          |
  |   - Loop cmd lists:         |
  |     - RSSetScissorRect      |
  |     - PSSetShaderResources  |
  |     - DrawIndexed           |
```

```
  +-----------------------------+
       |
       v
  +-----------------------------+
  | 5. PRESENT                  |
  |                             |
  | g_pSwapChain->Present(1,0)  |
  |                             |
  +-----------------------------+
       |
       v
```

```
  PROXIMO FRAME (volta ao 1)
```

```
10.3 - NewFrame (dx11.cpp:84-88)
```

```
----------------------------------
```

```
O NewFrame e a primeira etapa de cada frame. Ele prepara os backends e a
biblioteca para receber novos comandos de desenho.
```

```
  // File: splinter/src/dx11.cpp (linhas 84-88 aproximado)
  //
```

- `// Dentro do loop principal, antes de construir a GUI:` 

```
  // 1. NewFrame do backend DX11 - prepara buffers para novo frame
  ImGui_ImplDX11_NewFrame();
```

```
  // 2. NewFrame do backend Win32 - atualiza DisplaySize, DeltaTime, mouse
  ImGui_ImplWin32_NewFrame();
```

```
  // 3. NewFrame da ImGui - processa entrada, inicia o frame interno
  ImGui::NewFrame();
```

```
O que acontece dentro de cada chamada:
```

`1. ImGui_ImplDX11_NewFrame():` 

- `Verifica se a font texture existe (se nao, recria)` 

- `Marca o inicio de um novo frame para o renderer DX11` 

- `Nao faz muito mais - a maior parte da logica esta em RenderDrawData` 

`2. ImGui_ImplWin32_NewFrame():` 

- `Atualiza io.DisplaySize com GetClientRect()` 

- `Calcula io.DeltaTime (diferenca de tempo desde o ultimo frame)` 

- `Atualiza io.KeyCtrl, KeyShift, KeyAlt, KeySuper (GetKeyState)` 

- `Atualiza io.MousePos (GetCursorPos + ScreenToClient)` 

- `Atualiza estado do gamepad (se habilitado)` 

- `Chama io.ClearInputKeys() se a janela perdeu foco` 

`3. ImGui::NewFrame():` 

- `Processa todos os dados de entrada acumulados no ImGuiIO` 

- `Gera eventos de mouse (hover, click, double-click, drag)` 

- `Gera eventos de teclado (pressed, released, repeat)` 

- `Processa navegacao (Nav) se habilitada` 

- `Inicia a pilha de comandos de desenho` 

- `Prepara gerenciamento de janelas para o frame` 

- `Reseta estados internos (HoveredId, ActiveId, etc.)` 

- `Processa atalhos de teclado (menus, etc.)` 

- `Aplica configuracoes de docking/viewport` 

```
Estado do ImGuiContext APOS NewFrame():
```

- `IO processada e pronta para consulta` 

- `CurrentWindow = nullptr (nenhuma janela comecou ainda)` 

- `DrawList vazia para ser preenchida por widgets` 

- `HoveredId = 0, ActiveId = valor do frame anterior (ou 0)` 

```
10.4 - Widgets (gui.cpp:34-174)
```

```
----------------------------------
```

```
Apos o NewFrame, a aplicacao constroi a interface chamando as funcoes de
widget. No Splinter, isso e feito na funcao render_gui() em gui.cpp.
```

```
  // File: splinter/src/gui/gui.cpp (linhas 34-174 aproximado)
```

```
  void render_gui() {
      // --- Iniciar viewport dockspace (se docking habilitado) ---
      ImGui::DockSpaceOverViewport(
          ImGui::GetMainViewport(),
          ImGuiDockNodeFlags_PassthruCentralNode
      );
      // --- Janela principal do menu ---
      ImGui::SetNextWindowPos(ImVec2(50, 50), ImGuiCond_FirstUseEver);
      ImGui::SetNextWindowSize(ImVec2(400, 500), ImGuiCond_FirstUseEver);
      ImGui::Begin("Splinter Menu", nullptr,
                   ImGuiWindowFlags_NoDecoration);
```

```
      // --- Search bar ---
      draw_search_bar();
      // --- Abas ---
      draw_tabs();
      // --- Conteudo das abas ---
      if (active_tab == "Home") {
          draw_home_tab();
      } else if (active_tab == "Settings") {
          draw_settings_tab();
      } else if (active_tab == "About") {
          draw_about_tab();
      }
      // --- Footer com versao ---
      ImGui::Separator();
      ImGui::TextDisabled("Splinter v1.0");
      ImGui::End();
      // --- Watermark (sempre visivel, fora da janela principal) ---
      draw_watermark();
      // --- Notificacoes (toasts, sobrepoem tudo) ---
      draw_notifications();
      // --- Debug / Metrics (opcional) ---
      // ImGui::ShowMetricsWindow();
  }
```

```
Cada widget chamado dentro de Begin/End segue este fluxo interno:
```

```
  ImGui::Button("Clique Aqui") {
      // 1. PushID (hash do label + contexto atual)
      PushID("Clique Aqui");
      // 2. Calcular tamanho com estilo
      float width = style.FramePadding.x * 2 + text_width;
      float height = style.FramePadding.y * 2 + font_size;
      ImVec2 size(width, height);
      // 3. ItemSize + ItemAdd (registrar no layout e na tabela de hits)
      ItemSize(size);
      if (ItemAdd(bounding_box, id)) {
```

```
          // 4. Verificar hover
          bool hovered = false;
          if (io.MousePos dentro da bounding_box) {
              hovered = true;
              SetHoveredID(id);
          // 5. Verificar click
          bool clicked = false;
          if (hovered && io.MouseClicked[0]) {
              clicked = true;
              SetActiveID(id);
          // 6. Determinar cor baseada no estado
          ImU32 col = (active) ? col_active :
                      (hovered) ? col_hovered : col_normal;
```

```
          // 7. Desenhar retangulo (fundo do botao)
          window->DrawList->AddRectFilled(
              bounding_box.Min, bounding_box.Max,
              col, style.FrameRounding
          );
          // 8. Desenhar texto centralizado
          window->DrawList->AddText(
              text_center_pos, text_color, "Clique Aqui"
          );
          // 9. PopID
          PopID();
          // 10. Retornar bool
          return clicked;
      }
      PopID();
      return false;
  }
```

```
10.5 - Render / End_Frame (dx11.cpp:90-97)
---------------------------------------------
Apos construir toda a interface, a etapa de renderizacao finaliza o frame
e envia os comandos de desenho para a GPU.
```

```
  // File: splinter/src/dx11.cpp (linhas 90-97 aproximado)
  //
  // Dentro do loop principal, apos render_gui():
```

```
  // 1. Finalizar o frame ImGui - produz ImDrawData
  ImGui::Render();
  // 2. Obter os dados de desenho gerados
  ImDrawData* draw_data = ImGui::GetDrawData();
  // 3. Limpar o backbuffer (cor de fundo)
  const float clear_color[4] = { 0.08f, 0.08f, 0.10f, 1.00f };
  g_pd3dDeviceContext->ClearRenderTargetView(
      g_mainRenderTargetView, clear_color
  );
```

```
  // 4. Renderizar os comandos ImGui via backend DX11
  ImGui_ImplDX11_RenderDrawData(draw_data);
```

```
  // 5. Apresentar o frame na tela
  g_pSwapChain->Present(1, 0); // VSync = 1
```

- `// 6. Atualizar viewports secundarias (se multi-viewport habilitado) if (io.ConfigFlags & ImGuiConfigFlags_ViewportsEnable) { ImGui::UpdatePlatformWindows(); ImGui::RenderPlatformWindowsDefault(); }` 

```
Explicacao detalhada:
```

`1. ImGui::Render():` 

- `Finaliza o frame atual` 

- `Processa pilhas de estilo (PopStyleColor pendentes, etc.) - Fecha as draw lists (adiciona comandos finais) - Gera o ImDrawData contendo todas as draw lists de todas as janelas - Marca o frame como completo` 

`2. ImGui::GetDrawData():` 

- `Retorna o ponteiro para o ImDrawData do frame atual - Contem CmdLists[] com todos os comandos de desenho` 

`3. ClearRenderTargetView: - Limpa o backbuffer do DirectX 11 com a cor de fundo - A cor rgba(0.08, 0.08, 0.10, 1.00) corresponde ao fundo escuro do tema Splinter` 

`4. ImGui_ImplDX11_RenderDrawData(draw_data):` 

- `Processa todos os comandos de desenho (detalhado abaixo)` 

- `Renderiza por cima do fundo limpo` 

`5. g_pSwapChain->Present(1, 0):` 

- `Apresenta o frame renderizado` 

- `Parametro SyncInterval = 1: VSync habilitado (sincroniza com 60Hz)` 

- `Parametro Flags = 0: sem flags especiais` 

- `Em DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL, o Present troca os buffers de forma eficiente com o DWM` 

`6. UpdatePlatformWindows / RenderPlatformWindowsDefault:` 

- `Necessario apenas com ImGuiConfigFlags_ViewportsEnable` 

- `Atualiza e renderiza janelas secundarias (fora da janela principal)` 

- `Cada viewport tem seu proprio backend de renderizacao` 

```
10.6 - RenderDrawData Internamente
```

```
------------------------------------
```

```
A funcao ImGui_ImplDX11_RenderDrawData e o coracao da renderizacao. Vamos
analisar seu fluxo interno em detalhe:
```

```
  Entrada: ImDrawData* draw_data
```

```
  Passo 1: Verificar se ha dados validos
    if (draw_data == NULL || draw_data->CmdListsCount == 0)
        return;
```

```
  Passo 2: Calcular tamanho dos buffers
```

```
    vertex_buffer_size = TotalVtxCount * sizeof(ImDrawVert) = N * 20 bytes
    index_buffer_size  = TotalIdxCount * sizeof(ImDrawIdx)  = M * 2 bytes
```

```
  Passo 3: Criar/redimensionar buffers dinâmicos (se necessario)
    Se o buffer atual for menor que o necessario, libera e recria
    D3D11_USAGE_DYNAMIC + D3D11_CPU_ACCESS_WRITE = upload a cada frame
```

```
  Passo 4: Mapear buffers para escrita na CPU
```

```
    ctx->Map(VertexBuffer, D3D11_MAP_WRITE_DISCARD)
    ctx->Map(IndexBuffer,  D3D11_MAP_WRITE_DISCARD)
    WRITE_DISCARD: descarta conteudo anterior (nao precisa ler)
```

```
  Passo 5: Copiar vertices e indices para os buffers
    Para cada cmd_list em draw_data->CmdLists[]:
        memcpy(vertex_dst, cmd_list->VtxBuffer.Data,
               VtxBuffer.Size * sizeof(ImDrawVert))
        memcpy(index_dst, cmd_list->IdxBuffer.Data,
               IdxBuffer.Size * sizeof(ImDrawIdx))
        avancar ponteiros
```

```
  Passo 6: Desmapear buffers
    ctx->Unmap(VertexBuffer)
    ctx->Unmap(IndexBuffer)
```

```
  Passo 7: Configurar pipeline de entrada (IA - Input Assembler)
    IASetInputLayout(bd->InputLayout)
    IASetVertexBuffers(0, 1, &bd->VertexBuffer, stride=20, offset=0)
    IASetIndexBuffer(bd->IndexBuffer, DXGI_FORMAT_R16_UINT)
    IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST)
```

```
  Passo 8: Configurar shaders
    VSSetShader(bd->VertexShader)   // ImGui vertex shader
    PSSetShader(bd->PixelShader)    // ImGui pixel shader
    PSSetSamplers(0, 1, &bd->FontSampler)  // Sampler para textura
```

```
  Passo 9: Configurar estados de output
    OMSetBlendState(bd->BlendState)      // Alpha blending
    OMSetDepthStencilState(bd->DepthStencilState)  // Desabilitar depth
    RSSetState(bd->RasterizerState)      // Scissor enable, cull none
```

```
  Passo 10: Calcular matriz de projecao ortografica
    L = DisplayPos.x, R = DisplayPos.x + DisplaySize.x
    T = DisplayPos.y, B = DisplayPos.y + DisplaySize.y
    Matriz: {{2/(R-L), 0,        0, 0},
             {0,        2/(T-B), 0, 0},
             {0,        0,        0.5, 0},
             {(R+L)/(L-R), (T+B)/(B-T), 0.5, 1}}
    Enviar via constant buffer (VSSetConstantBuffers)
```

```
  Passo 11: Loop sobre draw lists
    int global_vtx_offset = 0;
    int global_idx_offset = 0;
```

```
    for (int n = 0; n < draw_data->CmdListsCount; n++) {
        ImDrawList* cmd_list = draw_data->CmdLists[n];
```

```
        for (int cmd_i = 0; cmd_i < cmd_list->CmdBuffer.Size; cmd_i++) {
            ImDrawCmd* pcmd = &cmd_list->CmdBuffer[cmd_i];
```

```
            // --- RSSetScissorRects (clipping) ---
            // Converte ClipRect (float) para RECT (LONG)
            RECT r = {
                .left   = (LONG)(pcmd->ClipRect.x - L),
                .top    = (LONG)(pcmd->ClipRect.y - T),
                .right  = (LONG)(pcmd->ClipRect.z - L),
                .bottom = (LONG)(pcmd->ClipRect.w - T)
            };
            ctx->RSSetScissorRects(1, &r);
```

```
            // --- PSSetShaderResources (texture) ---
            // TextureId contem o ponteiro ID3D11ShaderResourceView
            ID3D11ShaderResourceView* texture =
```

```
                (ID3D11ShaderResourceView*)pcmd->TextureId;
            ctx->PSSetShaderResources(0, 1, &texture);
            // --- UserCallback (opcional) ---
            if (pcmd->UserCallback) {
                pcmd->UserCallback(cmd_list, pcmd);
            } else {
                // --- DrawIndexed (renderizar triangulos) ---
                ctx->DrawIndexed(
                    pcmd->ElemCount,                 // Numero de indices
                    pcmd->IdxOffset + global_idx_offset,  // Offset indices
                    pcmd->VtxOffset + global_vtx_offset    // Offset vertices
                );
            }
        }
        global_vtx_offset += cmd_list->VtxBuffer.Size;
        global_idx_offset += cmd_list->IdxBuffer.Size;
    }
```

```
10.7 - Exemplo Numerico de um Frame
-------------------------------------
Vamos acompanhar um frame simples com uma janela contendo um botao:
```

```
  Frame N:
```

```
  1. NewFrame processa:
     - io.MousePos = (150, 200)
     - io.DeltaTime = 0.016f (60 FPS)
     - io.MouseDown[0] = false (nenhum clique)
```

`2. Widgets:` 

```
     - ImGui::Begin("Menu", ...)
         -> Cria/atualiza ImGuiWindow (pos: 50,50  size: 400x500)
         -> Cria/obtem ImDrawList para esta janela
     - ImGui::Button("OK")
         -> PushID("OK")
         -> Calcula bounding box: (60, 80) a (120, 110)
         -> ItemAdd: registra este ID na tabela de hits
         -> Mouse (150,200) DENTRO da box? SIM -> hover = true
         -> io.MouseDown[0] = false -> nao clicado
         -> AddRectFilled (60,80)-(120,110) cor hover
         -> AddText "OK" em (75, 86)
         -> PopID()
         -> retorna false
     - ImGui::End()
         -> Fecha draw list
```

`3. ImGui::Render():` 

- `Finaliza draw list, gera ImDrawData` 

```
     - CmdListsCount = 1 (uma janela)
     - CmdLists[0].VtxBuffer.Size = 32 vertices (4 vertices * 8 primitivas)
     - CmdLists[0].IdxBuffer.Size = 48 indices (6 indices * 8 triangulos)
     - CmdLists[0].CmdBuffer.Size = 2 comandos:
       [0] ClipRect=(0,0,400,500) TextureId=fontAtlas ElemCount=42
       [1] ClipRect=(0,0,400,500) TextureId=fontAtlas ElemCount=6
```

# `4. ClearRenderTargetView:` 

- `Limpa backbuffer com (0.08, 0.08, 0.10, 1.00)` 

`5. RenderDrawData:` 

- `Mapeia vertex buffer (32 * 20 = 640 bytes)` 

- `Mapeia index buffer (48 * 2 = 96 bytes)` 

- `Copia vertices e indices` 

- `Loop cmd_list[0]:` 

- `cmd[0]: RSSetScissor(0,0,400,500), texture=fontAtlas, DrawIndexed(42) cmd[1]: RSSetScissor(0,0,400,500), texture=fontAtlas, DrawIndexed(6)` 

`6. Present(1,0):` 

- `Apresenta frame com VSync` 

```
10.8 - Otimizacoes no Ciclo de Renderizacao
```

```
-----------------------------------------------
```

`1. Vertex/Index buffers dinâmicos: ImGui usa D3D11_USAGE_DYNAMIC e D3D11_MAP_WRITE_DISCARD. Isso evita alocar nova memoria a cada frame. O buffer e redimensionado apenas quando o frame exige mais vertices que a capacidade atual.` 

`2. Merge de comandos: ImGui agrupa comandos consecutivos com a mesma textura e estado em um unico DrawIndexed (merge otimizado).` 

`3. Clipping por janela: cada janela gera sua propria draw list com clipping especifico. Janelas escondidas ou fora da tela nao geram comandos de desenho.` 

`4. Font texture: a textura do atlas de fontes e criada uma unica vez e reutilizada em todos os frames (ate que as fontes sejam recarregadas).` 

`5. Instancing: alguns backends suportam instancing para reduzir chamadas de desenho (embora a ImGui padrao nao use).` 

- `10.9 - Resumo do Capitulo` 

- `--------------------------` 

- `O ciclo completo tem 5 etapas: NewFrame, Widgets, Render, Backend, Present` 

- `NewFrame (dx11.cpp:84-88): prepara backends e ImGui para o frame` 

- `Widgets (gui.cpp:34-174): constroi a interface com botoes, sliders, etc.` 

- `Render / end_frame (dx11.cpp:90-97): ImGui::Render(), Clear, RenderDrawData, Present` 

- `RenderDrawData internamente: loop cmd_lists -> loop cmds -> RSSetScissorRect (clipping) -> PSSetShaderResources (texture) -> DrawIndexed (triangulos)` 

- `Otimizacoes: buffers dinamicos, merge de comandos, clipping por janela, font texture reutilizada` 

```
===============================================================================
CURSO COMPLETO DE DEAR IMGUI - Capitulos 11 a 22
```

```
===============================================================================
===============================================================================
CAPITULO 11: DRAW LISTS E RENDERIZACAO INTERNA
```

```
11.1 - Visao Geral da Pipeline de Renderizacao
```

```
-----------------------------------------------
```

```
Quando voce chama ImGui::Button("OK"), o que realmente acontece por baixo
dos panos? A Dear ImGui nao renderiza diretamente nada. Em vez disso, ela
converte cada widget em uma serie de comandos de desenho que sao armazenados
em estruturas chamadas "Draw Lists" (listas de desenho). Estas listas sao
entregues ao backend de renderizacao (ex: DirectX 11) que as executa na GPU.
```

```
A pipeline completa e:
```

```
   [Widget] --> [ImDrawList] --> [ImDrawData] --> [Backend Render] --> [GPU]
```

```
   Widget (ex: Button):
```

```
     Chamadas como AddRectFilled, AddText que registram vertices, indices e
comandos
```

```
   ImDrawList (por janela):
```

```
     CmdBuffer: array de ImDrawCmd (comandos de desenho)
```

```
     VtxBuffer: array de ImDrawVert (vertices com pos, uv, cor)
     IdxBuffer: array de ImDrawIdx (indices para formar triangulos)
```

```
   ImDrawData (frame completo):
```

```
     CmdLists[]: array de ponteiros para todas as draw lists do frame
```

```
   Backend de Renderizacao (imgui_impl_dx11):
     Processa ImDrawData e emite chamadas DrawIndexed para a GPU
```

```
Diagrama da estrutura de dados:
```

```
   ImDrawData
```

```
   +-----------------------------+
   | Valid = true                |
   | CmdListsCount = N           |
   | TotalVtxCount = V           |
   | TotalIdxCount = I           |
   | DisplaySize = (w, h)        |
   +-----------------------------+
        |
        +-- [0] ImDrawList*
        |     +---------------------+
        |     | Name = "##splinter" |
        |     | VtxBuffer[]         |
        |     |  [0] pos=(10,10)    |
        |     |      uv=(0,0)       |
        |     |      col=0xFFFFFFFF  |
        |     |  [1] pos=(100,10)   |
        |     | IdxBuffer[]         |
        |     |  [0] 0, [1] 1, [2] 2 |
        |     | CmdBuffer[]         |
        |     |  [0] ClipRect       |
        |     |      TextureId      |
        |     |      VtxOffset=0    |
        |     |      IdxOffset=0    |
        |     |      ElemCount=6    |
        |     +---------------------+
        |
        +-- [1] ImDrawList* (BackgroundDrawList)
              +---------------------+
              | (fundo do Splinter) |
              +---------------------+
```

```
11.2 - Estruturas de Dados Internas
```

```
11.2.1 - ImDrawVert (imgui.h)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Cada vertice na pipeline da ImGui tem exatamente 3 campos:
```

```
   struct ImDrawVert {
       ImVec2  pos;            // Posicao do vertice em coordenadas de tela (x,
y)
       ImVec2  uv;             // Coordenada de textura (u, v)
       ImU32   col;            // Cor RGBA empacotada em 32 bits (0xAABBGGRR)
   };
```

```
Tamanho: 20 bytes (4+4+4+4+4). O campo col usa o formato IM_COL32 que
empacota RGBA em um unico unsigned int 32-bit. Os shifts:
```

```
   #define IM_COL32_R_SHIFT 0
   #define IM_COL32_G_SHIFT 8
   #define IM_COL32_B_SHIFT 16
   #define IM_COL32_A_SHIFT 24
```

```
No Splinter, o acesso direto a vertices apos AddText e feito em
textinput.cpp:49-55:
```

```
   ImDrawVert* verts = dl->VtxBuffer.Data;
   for (int v = vtx_start; v < vtx_end; v++) {
       verts[v].pos.x = cxc + (verts[v].pos.x - cxc) * eased;
       verts[v].pos.y = cyc + (verts[v].pos.y - cyc) * eased;
       int a = (int)(((verts[v].col >> IM_COL32_A_SHIFT) & 0xFF) * eased);
       verts[v].col = (verts[v].col & ~IM_COL32_A_MASK) | ((ImU32)a <<
IM_COL32_A_SHIFT);
   }
```

```
Este codigo modifica os vertices gerados por AddText (linha 46) para aplicar
animacao de escala e fade caractere por caractere. Acessa diretamente
VtxBuffer.Data, que e um array cru de ImDrawVert.
```

```
11.2.2 - ImDrawCmd (imgui.h)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Cada comando representa uma chamada DrawIndexed que sera enviada a GPU:
```

```
   struct ImDrawCmd {
       ImVec4          ClipRect;           // (x1, y1, x2, y2)
       ImTextureID     TextureId;          // Handle da textura
       unsigned int    VtxOffset;          // Offset no VtxBuffer global
       unsigned int    IdxOffset;          // Offset no IdxBuffer
       unsigned int    ElemCount;          // Numero de indices
       ImDrawCallback  UserCallback;       // Callback customizado
       void*           UserCallbackData;
   };
```

```
ClipRect: Regiao de recorte (scissor rect). A GPU so desenhara dentro deste
retangulo. No backend DX11, convertido para D3D11_RECT via RSSetScissorRects.
```

```
O Splinter usa PushClipRect/PopClipRect em dropdown.cpp:122:
   pdl->PushClipRect({ bx0 - 2.0f, ptop }, { bx0 + pw + 2.0f, ptop + reveal +
1.0f }, true);
```

```
TextureId: Handle opaco da textura (ID3D11ShaderResourceView* no DX11). O
valor TexUvWhitePixel e um pixel branco 1x1 para primitivas sem textura.
```

```
VtxOffset/IdxOffset: Offsets nos buffers globais. Permitem que cada ImDrawCmd
aponte para regioes diferentes sem recriar buffers.
```

```
ElemCount: Quantidade de indices. Triangulos = ElemCount / 3.
```

```
UserCallback: Raramente usado. Permite codigo customizado entre comandos.
```

```
11.2.3 - ImDrawList (imgui.h)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Cada janela tem sua propria draw list. Alem disso, existem BackgroundDrawList
e ForegroundDrawList globais.
```

```
   struct ImDrawList {
       char            Name[64];
       ImVector<ImDrawCmd>  CmdBuffer;
       ImVector<ImDrawIdx>  IdxBuffer;
       ImVector<ImDrawVert> VtxBuffer;
       ImDrawListFlags      Flags;
       int  _VtxCurrentOffset;
       int  _IdxCurrentOffset;
   };
```

```
Metodos principais:
   AddLine, AddRect, AddRectFilled, AddRectFilledMultiColor
```

```
   AddCircleFilled, AddCircle, AddTriangleFilled
   AddText, AddImage, AddBezierCubic, AddBezierQuadratic
   PushClipRect, PopClipRect
   PrimReserve, PrimWriteVtx, PrimWriteIdx
```

```
Cada Add* internamente:
```

`1. Calcula qtd de vertices e indices` 

`2. Chama PrimReserve para espaco nos buffers` 

`3. Escreve vertices com PrimWriteVtx` 

`4. Escreve indices com PrimWriteIdx` 

`5. Registra/estende ImDrawCmd com ClipRect e TextureId atuais` 

# `11.2.4 - ImDrawData (imgui.h)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Agrupa todas as draw lists de um frame completo:
```

```
   struct ImDrawData {
       bool            Valid;
       int             CmdListsCount;
       int             TotalIdxCount;
       int             TotalVtxCount;
       ImDrawList**    CmdLists;
       ImVec2          DisplayPos;
       ImVec2          DisplaySize;
       ImVec2          FramebufferScale;
   };
```

```
Apos ImGui::Render(), o backend obtem ImDrawData via ImGui::GetDrawData().
```

```
11.3 - Como um Widget Gera Comandos (Exemplo AddRectFilled)
```

```
------------------------------------------------------------
Vamos rastrear o que acontece quando o Splinter chama:
```

```
   dl->AddRectFilled({x,y}, {x+w,y+h}, IM_COL32(22,21,27,255), rounding);
```

```
Passos internos (dentro de ImDrawList::AddRectFilled em imgui_draw.cpp):
```

```
   PASSO 1: Calcular vertices e indices necessarios
```

```
     Se rounding==0: 4 vertices (1 quad), 6 indices (2 triangulos)
     Se rounding>0: mais vertices para cantos arredondados
```

```
   PASSO 2: PrimReserve(vtx_count, idx_count)
     Garante espaco nos buffers, faz realloc se necessario
     Atualiza _VtxCurrentOffset e _IdxCurrentOffset
```

```
   PASSO 3: Para cada vertice, PrimWriteVtx(pos, uv, col)
```

```
     uv = TexUvWhitePixel (pixel branco do atlas, pois nao e texto)
```

```
   PASSO 4: Para cada indice, PrimWriteIdx(idx)
     Indices apontam para vertices no VtxBuffer
```

```
   PASSO 5: Registrar/estender ImDrawCmd
```

```
     Se ultimo cmd tem mesmo ClipRect e TextureId:
       cmd->ElemCount += idx_count
     Senao: cria novo ImDrawCmd com ClipRect, TextureId, offsets
```

```
Este processo se repete centenas de vezes por frame.
```

```
11.4 - BackgroundDrawList vs ForegroundDrawList vs WindowDrawList
```

```
11.4.1 - WindowDrawList (GetWindowDrawList())
```

```
Cada janela tem sua propria draw list. Widgets dentro da janela escrevem nela.
O conteudo e automaticamente recortado para a regiao visivel.
```

```
   // combat.cpp:68 - obtendo a draw list da janela atual
   ImDrawList* dl = ImGui::GetWindowDrawList();
```

```
11.4.2 - BackgroundDrawList (GetBackgroundDrawList())
Desenha atras de todas as janelas. Usado para fundo personalizado.
```

```
O Splinter usa BackgroundDrawList em gui.cpp:50-94 para desenhar o painel
principal, header e bordas:
```

```
   ImDrawList* bg = ImGui::GetBackgroundDrawList();
   bg->AddRectFilled({panel_x,panel_y},{panel_x+panel_w,panel_y+panel_h},
       IM_COL32(22,21,27,255), corner_radius);
   bg->AddRectFilled({panel_x,panel_y},{panel_x+panel_w,panel_y+header_bar_h},
       IM_COL32(25,24,30,255), corner_radius, ImDrawFlags_RoundCornersTop);
   bg->AddLine({panel_x,panel_y+header_bar_h},
       {panel_x+panel_w,panel_y+header_bar_h}, IM_COL32(30,30,30,255), 1.0f);
   bg->AddRect({panel_x,panel_y},{panel_x+panel_w,panel_y+panel_h},
       IM_COL32(30,30,30,255), corner_radius, 0, 1.0f);
```

```
11.4.3 - ForegroundDrawList (GetForegroundDrawList())
Desenha sobre todas as janelas. Usado para tooltips, popups, watermark.
```

```
   // keybind.cpp:172, color_edit.cpp:261, watermark.cpp:65
   ImDrawList* pdl = ImGui::GetForegroundDrawList();
```

```
11.5 - Exemplo Detalhado: soft_shadow() em combat.cpp:23-62
---------------------------------------------------------------
A funcao soft_shadow e um exemplo completo de
PrimReserve/PrimWriteVtx/PrimWriteIdx
para desenhar geometria customizada diretamente nos buffers.
```

```
Codigo completo com explicacao:
```

```
   static void soft_shadow(ImDrawList* dl, float x0, float y0,
                           float x1, float y1, float r, float s, int alpha) {
       const float PI = 3.14159265f;
       ImU32 a = IM_COL32(0, 0, 0, alpha);
       ImU32 z = IM_COL32(0, 0, 0, 0);
       ImVec2 uv = dl->_Data->TexUvWhitePixel;
```

```
       // Lambda que desenha um quad (2 triangulos) com 4 vertices interpolados
       auto q = [&](ImVec2 p0, ImVec2 p1, ImVec2 p2, ImVec2 p3,
                    ImU32 c0, ImU32 c1, ImU32 c2, ImU32 c3) {
           dl->PrimReserve(6, 4);  // 6 indices (2 triangulos), 4 vertices
           ImDrawIdx i = (ImDrawIdx)dl->_VtxCurrentIdx;
           dl->PrimWriteVtx(p0, uv, c0);
           dl->PrimWriteVtx(p1, uv, c1);
           dl->PrimWriteVtx(p2, uv, c2);
           dl->PrimWriteVtx(p3, uv, c3);
           dl->PrimWriteIdx(i);   dl->PrimWriteIdx(i+1); dl->PrimWriteIdx(i+2);
           dl->PrimWriteIdx(i);   dl->PrimWriteIdx(i+2); dl->PrimWriteIdx(i+3);
       };
```

```
       // 4 quads: topo, fundo, esquerda, direita
       // Cor solida (a) na borda interna, transparente (z) na externa
       q({x0+r,y0},{x1-r,y0},{x1-r,y0-s},{x0+r,y0-s},a,a,z,z);
       q({x0+r,y1},{x1-r,y1},{x1-r,y1+s},{x0+r,y1+s},a,a,z,z);
       q({x0,y0+r},{x0,y1-r},{x0-s,y1-r},{x0-s,y0+r},a,a,z,z);
       q({x1,y0+r},{x1,y1-r},{x1+s,y1-r},{x1+s,y0+r},a,a,z,z);
       // Cantos arredondados com 14 segmentos cada
       auto corner = [&](float cx, float cy, float a0, float a1) {
           int seg = 14;
           for (int k = 0; k < seg; k++) {
```

```
               float t0 = a0+(a1-a0)*k/seg, t1 = a0+(a1-a0)*(k+1)/seg;
               ImVec2 in0={cx+cosf(t0)*r,cy+sinf(t0)*r};
               ImVec2 in1={cx+cosf(t1)*r,cy+sinf(t1)*r};
               ImVec2 ou0={cx+cosf(t0)*(r+s),cy+sinf(t0)*(r+s)};
               ImVec2 ou1={cx+cosf(t1)*(r+s),cy+sinf(t1)*(r+s)};
               q(in0,in1,ou1,ou0,a,a,z,z);
           }
       };
       corner(x0+r,y0+r,PI,PI*1.5f);
       corner(x1-r,y0+r,PI*1.5f,PI*2.0f);
       corner(x1-r,y1-r,0.0f,PI*0.5f);
       corner(x0+r,y1-r,PI*0.5f,PI);
   }
Chamada em combat.cpp:70:
   soft_shadow(dl, x, y, x+w, y+h, rounding, 12.0f, 45);
11.6 - Pipeline Completa ate a GPU
   FRAME N:
   |--- ImGui::NewFrame()
   |     Limpa estado, reseta draw lists
   |--- render_gui() (gui.cpp:34-174)
   |     |--- ImGui::Begin("##splinter", ...)
   |     |--- Widgets -> WindowDrawList -> PrimReserve/PrimWriteVtx/PrimWriteIdx
   |     |--- BackgroundDrawList (painel, header, abas)
   |     |--- ForegroundDrawList (popups, watermark)
   |     |--- ImGui::End()
   |--- ImGui::Render() -> ImDrawData
   |--- Backend DX11: para cada ImDrawCmd -> DrawIndexed()
   |--- SwapChain::Present()
```

```
11.7 - Resumo do Capitulo
  - ImDrawVert: 20 bytes, pos/uv/col
  - ImDrawCmd: comando DrawIndexed com ClipRect, TextureId, offsets
  - ImDrawList: colecao de vertices/indices/comandos por janela
  - ImDrawData: agrupa todas as draw lists do frame
  - Background/Foreground/Window: tres niveis
  - soft_shadow() em combat.cpp:23-62 com PrimReserve/PrimWriteVtx/PrimWriteIdx
```

```
===============================================================================
CAPITULO 12: SISTEMA DE IDS
```

```
12.1 - Por Que IDs Sao Necessarios?
No modo imediato, toda interface e reconstruida do zero a cada frame. Nao ha
objetos persistentes. Para rastrear estado entre frames, a ImGui usa IDs.
```

```
Usos: HoveredId (item sob mouse), ActiveId (item ativo/sendo arrastado),
estado TreeNode, scroll, animacoes via ImGuiStorage, identificacao de widgets.
```

```
12.2 - Hierarquia de IDs
   [Contexto Global]
       +-- [Janela (hash(nome))]
       |       +-- [PushID(int/string/pointer)]
       |       |       +-- [Chave Widget "##cb"] -> ID FINAL
       |       +-- [Popup/Dropdown]
       +-- [ImGuiStorage global]
```

```
Cada nivel adiciona ao hash. Resultado = ImGuiID (unsigned int 32-bit).
```

```
12.3 - Metodos PushID e PopID
```

```
PushID(int): usado em loops. Ex: combat.cpp:104:
   ImGui::PushID(1); widgets::slider_float("Slider",...); ImGui::PopID();
```

```
   ImGui::PushID(2); widgets::slider_int("Slider",...); ImGui::PopID();
```

```
PushID(const char*): usado no inicio de cada widget.
   // dropdown.cpp:30
   ImGui::PushID(label); ... ImGui::PopID();
   Internamente: IDStack.push_back(ImHashStr(str)).
```

```
PushID(const void*): qualquer ponteiro vira parte do hash.
```

```
PushID(int, int): para IDs 2D (grades).
```

```
12.4 - IDs Anonimos (##)
```

```
Tudo antes do ## e exibido na tela; tudo depois vira parte do ID.
```

```
   "OK":      texto="OK",     ID=hash(..."OK")
   "OK##1":   texto="OK",     ID=hash(..."OK##1")
   "##cb":    texto="",       ID=hash(..."##cb")
```

```
Exemplos:
   ImGui::InvisibleButton("##cb", ...);       // checkbox.cpp:42
   ImGui::InvisibleButton("##s", ...);         // slider.cpp:28
   ImGui::Begin("##splinter", ...);            // gui.cpp:41
   ImGuiID id_open = ImGui::GetID("##open");   // dropdown.cpp:52
```

# `12.5 - Colisoes de ID e Solucoes` 

```
Sintomas: widgets que nao respondem, dois destacados juntos, animacao quebrada.
Causas: mesmo label sem PushID, IDs fixos em listas variaveis.
```

```
Solucoes: PushID(i) em loops, PushID(label) em cada widget, ## para diferenciar.
```

```
No Splinter cada widget chama PushID(label) no inicio e PopID() no fim.
```

```
12.6 - State Storage (ImGuiStorage) para Animacao
ImGuiStorage mapeia ImGuiID para int/float/void*.
```

```
   static float ease(ImGuiID id, float target, float speed) {
       ImGuiStorage* st = ImGui::GetStateStorage();
       float v = st->GetFloat(id, target);
       v += (target - v) * (1.0f - expf(-ImGui::GetIO().DeltaTime * speed));
```

```
       st->SetFloat(id, v);
       return v;
   }
```

```
   // checkbox.cpp:57-58
   float ta = ease(ImGui::GetID("##a"), *v?1.0f:0.0f, 8.0f);
   float tf = ease(ImGui::GetID("##b"), *v?1.0f:0.0f, 16.0f);
```

```
12.7 - Ease Function Detalhada (checkbox.cpp:8-14)
Formula: v_n = v_{n-1} + (target - v_{n-1}) * (1 - e^(-dt * speed))
```

```
Frame 1: v=false, target=0.0 -> st->GetFloat(id,0.0)=0.0, v=0.0
Frame 2: v=true, target=1.0  -> st->GetFloat(id,1.0)=0.0, v=0.0+(1.0)*0.12=0.12
Frame 3: target=1.0          -> st->GetFloat=0.12, v=0.12+(0.88)*0.12=0.226
```

```
Para speed=8, dt=1/60: ~12% do gap por frame. Apos 1s: 99.9% do target.
```

```
12.8 - Resumo
```

- `IDs rastreiam estado entre frames no modo imediato` 

- `Hierarquia: Janela >> PushID >> Chave Widget` 

- `PushID(int), PushID(const char*), PushID(const void*), PushID(int,int)` 

- `##: texto exibido antes, ID depois` 

- `Colisoes resolvidas com PushID e ##` 

- `ImGuiStorage armazena animacoes; ease() = interpolacao exponencial` 

# `CAPITULO 13: GERENCIAMENTO DE ESTADO ENTRE FRAMES` 

```
13.1 - O Problema do Estado em Modo Imediato
```

```
No modo imediato, todo estado seria perdido entre frames sem mecanismos de
persistencia. A ImGui gerencia estado em 3 niveis:
```

```
Nivel 1: ImGuiContext (global) - todo o contexto
Nivel 2: ImGuiWindow (por janela) - estado de cada janela
Nivel 3: ImGuiStorage (mapa chave-valor) - estado arbitrario
```

# `13.2 - Os 3 Niveis de Estado` 

# `13.2.1 - ImGuiContext (Global)` 

```
Estrutura central (CreateContext/DestroyContext). Contem: IO, Style, Windows[],
HoveredId, ActiveId, pilhas (ColorStack, StyleVarStack, FontStack, IDStack),
CurrentWindow, DrawData, etc.
```

```
Acessado via: ImGui::GetCurrentContext()
```

```
13.2.2 - ImGuiWindow (Por Janela)
Cada janela Begin() tem seu ImGuiWindow persistente enquanto existir:
   Name, ID, Pos, Size, Scroll, Collapsed, DrawList, StateStorage, ClipRect
```

```
O objeto fica em ImGuiContext->Windows e e reutilizado se Begin() tem mesmo
nome.
```

```
13.2.3 - ImGuiStorage (Mapa Chave-Valor)
Dicionario ImGuiID -> valor (int/float/void*).
   SetInt(id,val), GetInt(id,default), SetFloat, GetFloat, SetBool, GetBool
```

```
Uso no Splinter:
```

```
   // dropdown.cpp:52-55 - estado do dropdown
   ImGuiStorage* st = ImGui::GetStateStorage();
   ImGuiID id_open = ImGui::GetID("##open");
   bool opened = st->GetInt(id_open, 0) != 0;
   st->SetInt(id_open, opened?1:0);   // dropdown.cpp:168
```

```
13.3 - Ciclo de Vida do Estado a Cada Frame
```

```
   [1. ImGui::NewFrame()]
```

```
     Reseta: HoveredId=0, ActiveId=0 (se nao persistir), CurrentWindow=NULL
     Reconstroi pilhas vazias, InputQueueCharacters.clear()
     Verifica janelas: se Begin() nao chamado, HiddenFrames++
   [2. render_gui()]
     Begin() reutiliza ImGuiWindow, restaura Pos/Size/Scroll
     Widgets usam ID para hover/active/click tracking
   [3. ImGui::Render()] -> produz ImDrawData
   [4. Backend renderiza] -> repete
```

```
13.4 - Como ImGui "Lembra" entre Frames (4 Etapas)
ETAPA 1 RESET: NewFrame() reseta transiente, nao persistente
ETAPA 2 RECONSTROI: interface reconstruida, mesmos IDs
ETAPA 3 VERIFICA: HoveredId, ActiveId, clique por ID
ETAPA 4 RESTAURA: scroll, TreeNode, ActiveId, Storage persistem
```

```
13.5 - Salvamento em Disco (imgui.ini)
Por padrao salva: posicao/tamanho janelas, TreeNode states, scroll.
Definido por: io.IniFilename = "imgui.ini"; (NULL = sem persistencia)
```

```
Splinter desabilita: io.IniFilename = nullptr;
```

```
Salvar/carregar manual:
   const char* data = ImGui::SaveIniSettingsToMemory();
   ImGui::LoadIniSettingsFromMemory(data);
```

```
13.6 - Gerenciamento Manual no Splinter
```

```
13.6.1 - Variaveis Estaticas (combat.cpp:9-21)
   static bool cb_enabled = true, cb_silent = false;
   static float sld_fov = 90.0f;
   static int sld_smooth = 5, rng_lo = 25, rng_hi = 50, dd_sel = 0;
   static bool ms_sel[3] = {true,true,false};
   static char ti_buf[64] = "";
   static widgets::keybind_t kb_state{};
13.6.2 - Variaveis Globais Inline
   int active_tab = 0; float tab_anim[32] = {0};  // gui.cpp:20-21
   char query[256] = ""; float anim = 0; bool focused = false; // search.cpp
   HWND hwnd; int width, height; // window.h
13.6.3 - ImGuiStorage para Animacoes
   float ot = ease(st, GetID("##ot"), opened?1:0, 14); // dropdown.cpp:60
   float ft = ease(st, GetID("##ft"), focused?1:0, 14); // textinput.cpp:128
13.7 - Persistencia Customizada (JSON/XML)
   void save_config(const char* path) {
       nlohmann::json j;
       j["cb_enabled"] = cb_enabled; j["sld_fov"] = sld_fov;
       std::ofstream(path) << j.dump(4);
   }
   void load_config(const char* path) {
       auto j = nlohmann::json::parse(std::ifstream(path));
       cb_enabled = j.value("cb_enabled", true);
       sld_fov = j.value("sld_fov", 90.0f);
   }
```

- `13.8 - Resumo - 3 niveis: ImGuiContext, ImGuiWindow, ImGuiStorage - Ciclo: reseta, reconstroi, verifica, restaura - .ini salva estado de janelas (Splinter desabilita) - Splinter usa variaveis estaticas e globais inline - ImGuiStorage para animacoes interpoladas` 

- `JSON/XML para persistencia entre sessoes` 

```
CAPITULO 14: MOUSE, TECLADO, GAMEPAD E EVENTOS
```

```
14.1 - Visao Geral do Sistema de Input
A ImGui depende de backends para traduzir eventos SO em ImGuiIO.
```

```
Fluxo: [SO] -> WM_* -> [Backend Win32] -> io.* -> [NewFrame] -> [Widgets]
```

```
14.2 - Tabela WM_* -> io.*
WM_MOUSEMOVE -> io.MousePos
WM_LBUTTONDOWN/UP -> io.MouseDown[0] true/false
WM_RBUTTONDOWN/UP -> io.MouseDown[1]
WM_MBUTTONDOWN/UP -> io.MouseDown[2]
WM_XBUTTONDOWN/UP -> io.MouseDown[3/4]
WM_MOUSEWHEEL -> io.MouseWheel
WM_KEYDOWN/UP -> io.KeysDown[wp]
WM_CHAR -> io.AddInputCharacter((ImWchar)wp)
WM_SIZE -> atualiza DisplaySize
WM_SETFOCUS/KILLFOCUS -> io.ClearInputKeys()
```

```
14.3 - WndProcHandler (window.cpp:53-54)
   LRESULT proc(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp) {
       if (ImGui_ImplWin32_WndProcHandler(hwnd, msg, wp, lp))
           return true; // ImGui consumiu
       switch (msg) {
       case WM_DESTROY: PostQuitMessage(0); return 0;
```

```
       case WM_SIZE:
           width=LOWORD(lp); height=HIWORD(lp); dx11::resize(width,height);
           return 0;
       }
       return DefWindowProc(hwnd, msg, wp, lp);
   }
```

- `14.4 - Deteccao de Interacao` 

```
IsItemHovered(): mouse sobre ultimo ItemAdd.
   InvisibleButton("##cb",{avail,row_h}); bool hovered=IsItemHovered();
```

```
IsItemActive(): item sendo arrastado/clicado.
```

```
   bool held = ImGui::IsItemActive(); // button.cpp:31
```

```
IsItemClicked(): clique completo neste frame.
```

```
   if (ImGui::InvisibleButton("##tab",{seg_w[i],pill_h})) active_tab=i;
```

```
IsMouseClicked(): botao pressionado neste frame.
```

```
   bool clicked = ImGui::IsMouseClicked(ImGuiMouseButton_Left); //
dropdown.cpp:49
```

- `IsMouseDown(): enquanto botao pressionado. bool down = ImGui::IsMouseDown(ImGuiMouseButton_Left); // color_edit.cpp:230` 

```
14.5 - InputQueueCharacters (search.cpp:58-67, textinput.cpp:97-104)
Buffer de caracteres processados (Shift/Caps/IME aplicados) via WM_CHAR.
```

```
Search bar (search.cpp:58-67):
```

```
   if (focused) {
       for (int i=0; i<io.InputQueueCharacters.Size; i++) {
           ImWchar c = io.InputQueueCharacters[i];
```

```
           if (c>=32 && c<127) {
               size_t len=strlen(query);
               if (len<sizeof(query)-1) { query[len]=(char)c; query[len+1]=0; }
           }
       }
       if (ImGui::IsKeyPressed(ImGuiKey_Backspace)) { ... }
   }
```

```
TextInput (textinput.cpp:97-104):
   if (focused) {
       for (int k=0; k<io.InputQueueCharacters.Size; k++) {
           ImWchar c = io.InputQueueCharacters[k];
           if (c>=32 && c<127 && len<(int)buf_size-1) {
               buf[len++]=(char)c; buf[len]='\0'; changed=true;
           }
       }
   }
```

```
14.6 - WantCaptureMouse/Keyboard
Flags que informam a aplicacao se ImGui consumiu input:
   io.WantCaptureMouse = true;
   io.WantCaptureKeyboard = true;
   io.WantTextInput = true;
```

```
A aplicacao DEVE verificar antes de processar input do jogo:
   if (!ImGui::GetIO().WantCaptureMouse) { /* jogo */ }
   if (!ImGui::GetIO().WantCaptureKeyboard) { /* atalhos do jogo */ }
```

```
14.7 - Entrada Customizada: GetAsyncKeyState() (keybind.cpp:108)
Para keybinds, Splinter usa GetAsyncKeyState() diretamente, pulando pipeline
da ImGui. Permite detectar teclas mesmo sem foco na janela.
```

```
   void update_binds() {
       for (int i=0; i<g_registry_count; i++) {
           keybind_t* v = g_registry[i].v;
           if (v->key<=0 || v->key>255) { v->prev_down=false; continue; }
           bool down = (GetAsyncKeyState(v->key) & 0x8000) != 0;
           if (v->mode==key_mode_toggle && down && !v->prev_down)
               v->toggle_state = !v->toggle_state;
           v->prev_down = down;
       }
   }
```

```
   bool keybind_active(keybind_t* v) {
       if (v->mode==key_mode_always) return true;
       if (v->key<=0 || v->key>255) return true;
       if (v->mode==key_mode_hold)
           return (GetAsyncKeyState(v->key) & 0x8000) != 0;
       if (v->mode==key_mode_toggle) return v->toggle_state;
       return false;
   }
```

```
Por que GetAsyncKeyState?
```

`1. ImGui captura teclas apenas com foco; 2. Le estado REAL a qualquer momento; 3. Keybinds funcionam sem foco na GUI.` 

```
14.8 - Hit Test Manual (comparacao de posicoes)
```

```
Checkbox (checkbox.cpp:46-52):
   bool on_kb = kb && mp.x>=kb_x-4 && mp.x<=kb_x+kb_size+4 &&
                     mp.y>=kb_y-4 && mp.y<=kb_y+kb_size+4;
   bool on_col = false;
   if (col) { float dx=mp.x-col_cx, dy=mp.y-col_cy;
       on_col = (dx*dx+dy*dy) <= ((col_r+3)*(col_r+3)); }
   if (IsItemClicked() && !on_kb && !on_col) *v = !*v;
```

```
Dropdown (dropdown.cpp:48,133):
   bool in_box = mp.x>=bx0 && mp.x<=bx1 && mp.y>=by0 && mp.y<=by1;
   bool ohover = interact && mp.x>=bx0 && mp.x<=bx0+pw && mp.y>=y &&
mp.y<=y+item_h;
```

```
Keybind (keybind.cpp:146-147,309):
   bool in_trig = mp.x>=tx0 && mp.x<=tx1 && mp.y>=ty0 && mp.y<=ty1;
   bool in_popup = mp.x>=px && mp.x<=px+pw && mp.y>=py && mp.y<=py+ph;
```

```
ColorEdit (color_edit.cpp:554-556):
   float dx=mp.x-cx, dy=mp.y-cy;
   bool in_swatch = (dx*dx+dy*dy) <= (radius*radius);
```

- `14.9 - Resumo` 

- `Backend Win32 traduz WM_* em ImGuiIO` 

- `WndProcHandler em window.cpp:53-54` 

- `IsItemHovered/Active/Clicked para deteccao` 

- `InputQueueCharacters para texto (search.cpp:58-67, textinput.cpp:97-104)` 

- `WantCaptureMouse/Keyboard evitam input passar ao jogo` 

- `GetAsyncKeyState() para keybinds (keybind.cpp:108)` 

- `Hit test manual com comparacao de posicoes retangulares/circulares` 

```
===============================================================================
CAPITULO 15: FONTES
```

```
15.1 - ImFontAtlas (io.Fonts)
```

```
O sistema de fontes e centrado no ImFontAtlas. Gerencia: carregamento de
fontes TTF/OTF, rasterizacao de glyphs (stb_truetype ou FreeType),
empacotamento em textura (atlas), geracao de textura RGBA para GPU.
```

```
Acessado via: ImFontAtlas* atlas = ImGui::GetIO().Fonts;
```

```
O atlas contem: Fonts[], TexPixelsRGBA32, TexWidth, TexHeight, TexReady,
TexUvWhitePixel[2].
```

```
Quando voce adiciona fonte e constroi o atlas:
```

`1. Glyphs rasterizadas em bitmaps individuais` 

`2. Bitmaps empacotados em textura (rectangle packing)` 

`3. Cada glyph recebe coordenadas UV` 

`4. Textura enviada para GPU pelo backend de renderizacao` 

```
15.2 - Carregamento (fonts.cpp:7-22)
   void load_fonts() {
       ImGuiIO& io = ImGui::GetIO();
       ImFontConfig text_cfg;
       text_cfg.FontDataOwnedByAtlas = false;
       io.Fonts->AddFontFromMemoryTTF(
           (void*)fredoka_ttf_data, (int)fredoka_ttf_size, 18.0f, &text_cfg
       );
       static const ImWchar range[] = { 0x0020, 0xFFFF, 0 };
       ImFontConfig icon_cfg;
       icon_cfg.FontDataOwnedByAtlas = false;
       icons = io.Fonts->AddFontFromMemoryTTF(
           (void*)icons_ttf_data, (int)icons_ttf_size, 20.0f, &icon_cfg, range
       );
   }
```

```
FontDataOwnedByAtlas=false porque dados estao em arrays estaticos compilados
no binario (fredoka_font.h, icons_font.h), nao devem ser liberados pelo atlas.
```

# `15.3 - Metodos de Carregamento` 

- `AddFontFromFileTTF(): carrega de arquivo TTF/OTF no disco.` 

- `ImFont* font = io.Fonts->AddFontFromFileTTF("Fredoka.ttf", 16.0f); ImFontConfig cfg; cfg.OversampleH=2; cfg.PixelSnapH=true; ImFont* font2 = io.Fonts->AddFontFromFileTTF("font.ttf", 16.0f, &cfg);` 

- `AddFontFromMemoryTTF(): carrega de dados TTF em memoria (embarcados). ImFont* font = io.Fonts->AddFontFromMemoryTTF( (void*)font_data, font_data_size, 16.0f, &font_cfg, glyph_ranges);` 

- `AddFontFromMemoryCompressedTTF(): carrega de dados comprimidos (descomprime em runtime). Reduz tamanho do binario.` 

- `ImFont* font = io.Fonts->AddFontFromMemoryCompressedTTF( compressed_data, compressed_size, 16.0f);` 

- `AddFontDefault(): fonte padrao ProggyClean 13px. Chamado por CreateContext().` 

- `15.4 - Multiplas Fontes: PushFont/PopFont (keybind.cpp:339-345) if (splinter::assets::icons) { ImGui::PushFont(splinter::assets::icons); const char* icon = "\xEF\x81\x90"; float iw = ImGui::CalcTextSize(icon).x; dl->AddText(splinter::assets::icons, ImGui::GetFontSize(), {floorf(bx0+8.0f), kty}, kcol, icon); ImGui::PopFont(); dl->AddText({floorf(bx0+8.0f+iw+6.0f), kty}, kcol, kn); }` 

```
PushFont afeta pilha de fontes; AddText sem fonte explicita usa a do topo.
```

```
15.5 - Font Atlas Texture e TexUvWhitePixel
Apos construir o atlas, textura com glyphs e gerada e enviada a GPU.
TexUvWhitePixel = pixel branco 1x1 no atlas.
```

```
   ImVec2 uv = dl->_Data->TexUvWhitePixel;  // combat.cpp:27
   ImVec2 uv = ImGui::GetFontTexUvWhitePixel();  // forma alternativa
```

```
Quando GPU processa vertice com uv=TexUvWhitePixel, pixel shader multiplica
textura (branca) pela cor do vertice, resultando em cor solida.
```

```
15.6 - FreeType vs stb_truetype (IMGUI_ENABLE_FREETYPE)
```

```
stb_truetype (padrao): imstb_truetype.h, zero dependencias, rapido e leve,
qualidade inferior em <12px, sem hinting avancado.
```

```
FreeType (opcional): #define IMGUI_ENABLE_FREETYPE em imconfig.h, requer
freetype.lib. Qualidade superior, hinting avancado (LightHinting, MonoHinting),
kerning, SVG em OpenType. Maior binario.
```

```
O Splinter NAO usa FreeType (usa stb_truetype padrao).
```

```
15.7 - Glyph Ranges Customizados
Padrao: ASCII + Latin-1 (0x0020-0x00FF). Para mais caracteres:
   static const ImWchar ranges[] = {
       0x0020, 0x00FF,  // Latin-1
       0x0100, 0x024F,  // Latin Extended
       0x0400, 0x04FF,  // Cyrillic
       0
   };
```

```
Splinter para icones: range[] = { 0x0020, 0xFFFF, 0 };  // Tudo!
```

```
Ranges eficientes para icones:
   static const ImWchar icons_ranges[] = { ICON_MIN_FA, ICON_MAX_FA, 0 };
```

```
15.8 - ImFont e ImFontConfig
   struct ImFont {
       ImFontAtlas* ContainerAtlas;
       float FontSize, Scale;
       ImWchar FallbackChar;
       float Ascent, Descent;
   };
```

```
   struct ImFontConfig {
       void* FontData; int FontDataSize;
       bool FontDataOwnedByAtlas;
       float SizePixels;
       int OversampleH, OversampleV;
       bool PixelSnapH;
       ImVec2 GlyphExtraSpacing, GlyphOffset;
       const ImWchar* GlyphRanges;
       float RasterizerMultiply;
       bool MergeMode;  // Mesclar com fonte anterior (para icones!)
   };
```

```
MergeMode=true adiciona glyphs desta fonte aos da anterior, permitindo
misturar texto normal com icones na mesma string.
```

- `15.9 - Resumo` 

- `ImFontAtlas gerencia fontes e textura (io.Fonts) - Splinter: AddFontFromMemoryTTF em fonts.cpp:7-22` 

- `3 metodos: FromFileTTF, FromMemoryTTF, FromMemoryCompressedTTF - PushFont/PopFont alternam fontes (keybind.cpp:339-345)` 

- `TexUvWhitePixel = pixel branco 1x1 no atlas` 

- `FreeType > stb_truetype (mas requer dependencia) - Glyph ranges controlam quais caracteres rasterizar` 

```
CAPITULO 16: TEMAS, ESTILOS E CORES
```

```
16.1 - Personalizacao de Estilo (GetStyle)
ImGuiStyle& style = ImGui::GetStyle();
Campos: WindowPadding, FramePadding, ItemSpacing, WindowRounding,
FrameRounding, WindowBorderSize, FrameBorderSize, Alpha, ScrollbarSize,
GrabMinSize, Colors[ImGuiCol_COUNT] (137+ cores).
```

```
16.2 - Tema Splinter (theme.cpp:4-45)
   void apply() {
       ImGuiStyle& style = ImGui::GetStyle();
       ImVec4* colors = style.Colors;
```

```
       style.WindowPadding={0,0}; style.FramePadding={8,6};
       style.ItemSpacing={8,6}; style.WindowRounding=10.0f;
       style.FrameRounding=6.0f; style.GrabRounding=4.0f;
       style.ScrollbarRounding=4.0f;
       style.WindowBorderSize=0; style.FrameBorderSize=0;
       style.ChildBorderSize=1.0f; style.PopupBorderSize=0;
```

```
       colors[ImGuiCol_WindowBg]   = ImVec4(22/255.f,21/255.f,27/255.f,1);
       colors[ImGuiCol_ChildBg]    = ImVec4(22/255.f,21/255.f,27/255.f,1);
       colors[ImGuiCol_Border]     = ImVec4(30/255.f,30/255.f,30/255.f,1);
       colors[ImGuiCol_FrameBg]    = ImVec4(.12f,.12f,.15f,1);
       colors[ImGuiCol_FrameBgHovered]=ImVec4(.15f,.15f,.18f,1);
       colors[ImGuiCol_FrameBgActive]=ImVec4(.18f,.18f,.22f,1);
       colors[ImGuiCol_Button]     = ImVec4(.12f,.12f,.15f,1);
       colors[ImGuiCol_ButtonHovered]=ImVec4(.18f,.18f,.22f,1);
       colors[ImGuiCol_ButtonActive]=ImVec4(.22f,.22f,.26f,1);
       colors[ImGuiCol_Text]       = ImVec4(.85f,.85f,.88f,1);
       colors[ImGuiCol_TextDisabled]=ImVec4(.4f,.4f,.45f,1);
       colors[ImGuiCol_ScrollbarBg]=ImVec4(.08f,.08f,.10f,1);
       colors[ImGuiCol_ScrollbarGrab]=ImVec4(.2f,.2f,.25f,1);
       colors[ImGuiCol_ScrollbarGrabHovered]=ImVec4(.25f,.25f,.3f,1);
       colors[ImGuiCol_ScrollbarGrabActive]=ImVec4(.3f,.3f,.35f,1);
       colors[ImGuiCol_CheckMark]  = accent;
       colors[ImGuiCol_SliderGrab] = accent;
```

```
colors[ImGuiCol_SliderGrabActive]=ImVec4(accent.x*1.2f,accent.y*1.2f,accent.z*1.
2f,1);
```

```
       colors[ImGuiCol_Header]     = ImVec4(.12f,.12f,.15f,1);
       colors[ImGuiCol_HeaderHovered]=ImVec4(.15f,.15f,.18f,1);
       colors[ImGuiCol_HeaderActive]=ImVec4(.18f,.18f,.22f,1);
       colors[ImGuiCol_Separator]  = ImVec4(.15f,.15f,.18f,1);
       colors[ImGuiCol_Tab]        = ImVec4(.10f,.10f,.13f,1);
       colors[ImGuiCol_TabHovered]=ImVec4(accent.x,accent.y,accent.z,.3f);
       colors[ImGuiCol_TabSelected]=ImVec4(accent.x,accent.y,accent.z,.2f);
   }
```

```
16.3 - IM_COL32 Macro e Shifts
   #define IM_COL32(R,G,B,A) \
       (((ImU32)(A)<<IM_COL32_A_SHIFT)|((ImU32)(B)<<IM_COL32_B_SHIFT)|\
        ((ImU32)(G)<<IM_COL32_G_SHIFT)|((ImU32)(R)<<IM_COL32_R_SHIFT))
   #define IM_COL32_R_SHIFT 0  #define IM_COL32_G_SHIFT 8
   #define IM_COL32_B_SHIFT 16 #define IM_COL32_A_SHIFT 24
```

```
IM_COL32(255,0,0,255) = 0xFF0000FF (vermelho opaco).
```

```
Para extrair componentes:
   int r=(c>>IM_COL32_R_SHIFT)&0xFF, g=(c>>IM_COL32_G_SHIFT)&0xFF,
       b=(c>>IM_COL32_B_SHIFT)&0xFF, a=(c>>IM_COL32_A_SHIFT)&0xFF;
```

```
16.4 - Manipulacao de Cores: mod() e lerp_col() (dropdown.cpp:17-26)
```

```
mod() (dropdown.cpp:17-20): modula alpha por fator f.
   static ImU32 mod(ImU32 c, float f) {
       int a=(int)(((c>>IM_COL32_A_SHIFT)&0xFF)*f);
       return (c & ~IM_COL32_A_MASK)|((ImU32)a<<IM_COL32_A_SHIFT);
   }
Uso: mod(IM_COL32(25,24,30,255), fade) para fade animado.
```

```
lerp_col() (dropdown.cpp:22-26): interpola linearmente entre duas cores.
   static ImU32 lerp_col(ImU32 a, ImU32 b, float t) {
       int ar=(a>>IM_COL32_R_SHIFT)&0xFF, ...;
       int br=(b>>IM_COL32_R_SHIFT)&0xFF, ...;
       return IM_COL32((int)(ar+(br-ar)*t), (int)(ag+(bg-ag)*t),
                       (int)(ab+(bb-ab)*t), (int)(aa+(ba-aa)*t));
   }
t=0: cor a, t=1: cor b, t=0.5: meio.
```

```
Uso em dropdown.cpp:69-71:
   ImU32 box_border = lerp_col(IM_COL32(35,32,38,255),
       IM_COL32(accent_r,accent_g,accent_b,255), 0.30f*bh+0.55f*ot);
```

```
Uso em textinput.cpp:137-138:
   ImU32 border = lerp_col(IM_COL32(35,32,38,255),
       IM_COL32(accent_r,accent_g,accent_b,255), 0.30f*ht+0.55f*ft);
```

```
Uso em button.cpp:53-55 (com click flash):
   ImU32 border = lerp_col(IM_COL32(35,32,38,255),
       IM_COL32(accent_r,accent_g,accent_b,255), fmaxf(0.30f*ht, cv));
```

```
16.5 - Transparencia (Alpha) para Overlays
Alpha fixo:
```

```
   soft_shadow(dl, x, y, x+w, y+h, rounding, 12.0f, 45); // combat.cpp:45
   IM_COL32(accent_r, accent_g, accent_b, (int)(255*0.10f*ta)); //
checkbox.cpp:71
```

# `Alpha animado:` 

```
   pdl->AddRectFilled(..., mod(IM_COL32(25,24,30,255), fade), ...); //
dropdown.cpp:125
```

```
   auto mod_fn = [&](ImU32 c) { int a=(int)(((c>>IM_COL32_A_SHIFT)&0xFF)*eased);
       return (c&~IM_COL32_A_MASK)|((ImU32)a<<IM_COL32_A_SHIFT); }; //
color_edit.cpp:265
```

```
16.6 - Temas Pre-Definidos
   ImGui::StyleColorsDark();    // Tema escuro (padrao desde 1.60)
   ImGui::StyleColorsLight();   // Tema claro
   ImGui::StyleColorsClassic(); // Estilo original
```

```
Splinter nao usa nenhum; define cores manualmente em theme.cpp.
```

# `16.7 - Resumo` 

- `ImGui::GetStyle() para modificar estilo` 

- `Tema Splinter (theme.cpp:4-45): cores escuras com accent azul` 

- `IM_COL32 com shifts R=0, G=8, B=16, A=24` 

- `mod() modula alpha (dropdown.cpp:17-20)` 

- `lerp_col() interpola cores (dropdown.cpp:22-26)` 

- `Alpha para overlays, sombras, animacoes` 

- `3 temas pre-definidos: Dark, Light, Classic` 

# `CAPITULO 17: JANELAS, CHILD WINDOWS, POPUPS E MODAIS` 

# `17.1 - Introducao` 

```
Todo conteudo na ImGui e organizado em janelas. Tipos: normais (Begin/End),
child (BeginChild/EndChild), popups (BeginPopup/EndPopup), modais
(BeginPopupModal), tooltips (BeginTooltip), menus (BeginMenu/EndMenu).
```

```
17.2 - ImGui::Begin/End - Parametros e Retorno
   bool Begin(const char* name, bool* p_open=NULL, ImGuiWindowFlags flags=0);
   Retorno: true = janela visivel; false = recolhida/invisivel.
   name: NOME UNICO. ## para nomes anonimos.
   p_open: se nao NULL, mostra botao X.
   IMPORTANTE: SEMPRE chame End() se Begin() foi chamado.
```

```
17.3 - Todas as ImGuiWindowFlags
   ImGuiWindowFlags_None = 0
   NoTitleBar = 1<<0, NoResize = 1<<1, NoMove = 1<<2
   NoScrollbar = 1<<3, NoScrollWithMouse = 1<<4
   NoCollapse = 1<<5, AlwaysAutoResize = 1<<6
   NoBackground = 1<<7, NoSavedSettings = 1<<8
   NoMouseInputs = 1<<9, MenuBar = 1<<10
   HorizontalScrollbar = 1<<11, NoFocusOnAppearing = 1<<12
   NoBringToFrontOnFocus = 1<<13
   AlwaysVerticalScrollbar = 1<<14, AlwaysHorizontalScrollbar = 1<<15
   NoNavInputs = 1<<16, NoNavFocus = 1<<17
   UnsavedDocument = 1<<18, NoDocking = 1<<19
```

```
Combinacoes uteis:
   NoDecoration = NoTitleBar|NoResize|NoScrollbar|NoCollapse
   NoInputs = NoMouseInputs|NoNavInputs|NoNavFocus
```

```
17.4 - Janela Principal do Splinter (gui.cpp:39-48)
   ImGui::SetNextWindowPos({0,0});
   ImGui::SetNextWindowSize({(float)width, (float)height});
   ImGui::Begin("##splinter", nullptr,
       ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize |
       ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoCollapse |
       ImGuiWindowFlags_NoBringToFrontOnFocus | ImGuiWindowFlags_NoBackground);
```

```
NoTitleBar: header customizado via BackgroundDrawList (gui.cpp:73-80).
NoResize: ocupa tela inteira.
NoMove: posicao fixa (0,0); movimento Win32 via update_drag().
NoCollapse: nao faz sentido recolher janela principal.
NoBringToFrontOnFocus: apenas 1 janela.
NoBackground: CRUCIAL - fundo desenhado manualmente (gui.cpp:66-94).
```

```
17.5 - Child Windows (combat.cpp:86)
Sub-janelas com clipping e scroll independentes:
   ImGui::BeginChild("##section",
       {w-inner_pad*2.0f, h-bar_h}, ImGuiChildFlags_None,
       ImGuiWindowFlags_NoScrollbar);
   ImGui::Dummy({0, 6.0f});
   if (content) content();
   ImGui::EndChild();
```

- `section() (combat.cpp:64-93): 1. soft_shadow 2. fundo+borda 3. header 4. child window 5. callback de conteudo.` 

```
17.6 - Popups: OpenPopup, BeginPopup, EndPopup
Ciclo: OpenPopup("nome") -> BeginPopup("nome") -> widgets -> EndPopup()
Fecham ao clicar fora. Flags: MouseButtonLeft/Right/Middle, AnyPopupId.
```

```
17.7 - Modais: BeginPopupModal
BLOQUEIAM interacao com o resto. Nao fecham ao clicar fora.
   if (ImGui::BeginPopupModal("Confirm", NULL,
ImGuiWindowFlags_AlwaysAutoResize)) {
       ImGui::Text("Tem certeza?");
       if (ImGui::Button("OK")) { ImGui::CloseCurrentPopup(); }
       ImGui::EndPopup();
   }
```

```
17.8 - Popups Customizados no Splinter
Splinter NAO usa OpenPopup/BeginPopup. Implementa popups customizados.
```

```
Dropdown Popup (dropdown.cpp:108-162): usa ImGui::Begin com flags:
   ImGui::Begin(("##ddpop_"+label).c_str(), nullptr,
       NoTitleBar|NoResize|NoMove|NoSavedSettings|NoScrollbar|NoScrollWithMouse|
NoFocusOnAppearing);
```

```
Controle manual: st->SetInt(id_open, opened?1:0);
```

```
Color Picker Popup (color_edit.cpp:257-513): desenha na ForegroundDrawList:
   ImDrawList* pdl = ImGui::GetForegroundDrawList();
Posicionamento manual com deteccao de bordas.
```

```
Keybind Picker Popup (keybind.cpp:168-275): ForegroundDrawList com modos
(Always/Hold/Toggle) e area de captura (listening).
```

```
17.9 - Resumo
```

- `Begin/End criam janelas; sempre chame End` 

```
  - Flags: NoTitleBar, NoResize, NoMove, NoBackground, etc.
```

```
  - Janela principal Splinter: 6 flags (gui.cpp:39-48)
```

- `Child windows: sub-regioes (combat.cpp:86)` 

- `Popups nativos: OpenPopup + BeginPopup` 

- `Modais: BeginPopupModal (bloqueiam)` 

- `Splinter implementa popups customizados com Begin/ForegroundDrawList` 

```
===============================================================================
CAPITULO 18: TODOS OS WIDGETS EXPLICADOS
```

```
18.1 - Widgets Nativos da Dear ImGui
```

```
// TEXT
void Text(const char* fmt, ...);
void TextColored(const ImVec4& col, const char* fmt, ...);
void TextDisabled(const char* fmt, ...);
void TextUnformatted(const char* text, const char* text_end=NULL);
void LabelText(const char* label, const char* fmt, ...);
void BulletText(const char* fmt, ...);
```

```
// BUTTON
```

```
bool Button(const char* label, const ImVec2& size=ImVec2(0,0));
bool SmallButton(const char* label);
bool InvisibleButton(const char* str_id, const ImVec2& size,
ImGuiButtonFlags=0);
```

```
bool ArrowButton(const char* str_id, ImGuiDir dir);
```

```
// CHECKBOX / RADIO
bool Checkbox(const char* label, bool* v);
bool RadioButton(const char* label, bool active);
bool RadioButton(const char* label, int* v, int v_button);
```

```
// SLIDER / DRAG
bool SliderFloat(const char* label, float* v, float vmin, float vmax,
                 const char* fmt="%.3f", ImGuiSliderFlags=0);
bool SliderInt(const char* label, int* v, int vmin, int vmax);
bool DragFloat(const char* label, float* v, float speed=1.0f,
               float vmin=0, float vmax=0);
bool DragInt(const char* label, int* v, float speed=1.0f, int vmin=0, int
vmax=0);
```

```
// INPUT
bool InputText(const char* label, char* buf, size_t buf_size,
               ImGuiInputTextFlags=0, ImGuiInputTextCallback=NULL, void*
data=NULL);
```

```
bool InputInt(const char* label, int* v, int step=1, int step_fast=100);
bool InputFloat(const char* label, float* v, float step=0, float step_fast=0,
                const char* fmt="%.3f");
```

```
// COMBO / LISTBOX
bool BeginCombo(const char* label, const char* preview, ImGuiComboFlags=0);
void EndCombo();
bool Combo(const char* label, int* cur, const char* const items[], int count);
bool ListBox(const char* label, int* cur, const char* const items[], int count);
```

```
// COLOR
bool ColorEdit3(const char* label, float col[3]);
bool ColorEdit4(const char* label, float col[4], ImGuiColorEditFlags=0);
bool ColorPicker3(const char* label, float col[3]);
bool ColorPicker4(const char* label, float col[4], ImGuiColorEditFlags=0);
```

```
// TREE
bool TreeNode(const char* label);
bool CollapsingHeader(const char* label, ImGuiTreeNodeFlags=0);
void TreePush(const char* str_id); void TreePop();
```

```
// SELECTABLE / MENU
bool Selectable(const char* label, bool selected=false, ImGuiSelectableFlags=0);
bool MenuItem(const char* label, const char* shortcut=NULL,
              bool selected=false, bool enabled=true);
bool BeginMenu(const char* label, bool enabled=true); void EndMenu();
```

```
// MISC
void ProgressBar(float fraction, const ImVec2& size=ImVec2(-1,0));
void Image(ImTextureID tex, const ImVec2& size);
void Separator(); void Spacing(); void Dummy(const ImVec2& size);
void SameLine(float offset=0, float spacing=-1);
void BeginGroup(); void EndGroup();
ImVec2 GetContentRegionAvail();
```

```
18.2 - Widgets Customizados do Splinter (widgets.h)
checkbox.h/.cpp     -> bool checkbox(label, *v, kb, col)
slider.h/.cpp       -> bool slider_float(label, *v, min, max, fmt)
                       bool slider_int(label, *v, min, max)
                       bool slider_range_int(label, *lo, *hi, min, max)
dropdown.h/.cpp     -> bool dropdown(label, *sel, items, count)
                       bool multi_dropdown(label, sel[], items, count)
text_input.h/.cpp   -> bool text_input(label, buf, buf_size, placeholder)
button.h/.cpp       -> bool button(label)
keybind.h/.cpp      -> bool keybind(label, *v)
                       bool keybind_icon(id, x, y, size, *v)
                       void register_bind(name, *v)
                       bool keybind_active(*v)
color_edit.h/.cpp   -> bool color_edit(label, col[4])
                       bool color_edit3(label, col[3])
                       bool color_swatch(id, cx, cy, radius, col[4])
```

```
18.3 - Checkbox (checkbox.cpp:16-102)
Toggle animado com suporte a keybind e color swatch.
```

```
Parametros: label, *v (bool), kb (keybind_t* opcional), col (float[4] opcional)
```

```
Layout:
   [==O========] Label Text                [K] [O]
   toggle       label              keybind   color swatch
Fluxo completo:
1. search::matches(label) - filtro (linha 17)
```

```
2. PushID(label) - escopo (linha 18)
```

`3. Calcular posicoes: toggle, label, keybind_x/y, col_cx/cy (linhas 20-40)` 

`4. InvisibleButton("##cb",{avail,row_h}) para hover/click (linha 42)` 

`5. Hit test manual para keybind e color swatch (linhas 46-52)` 

`6. Alternar *v se clicado fora de kb/col (linha 54-55)` 

`7. Animacao ease: ta (glow, speed=8), tf (circulo, speed=16) (linhas 57-58)` 

`8. Desenhar fundo do switch com AddRectFilled (linhas 69-71)` 

`9. Desenhar glow com accent*10%*ta (linha 71)` 

```
10. Desenhar circulo deslizante AddCircleFilled (linha 82)
     cd = sh-4, indent=2, travel = sw-indent*2-cd
     cx = sx0+indent+cd*0.5+travel*tf
```

`11. Cor do circulo interpola de (92,92,102) para accent (linhas 79-81)` 

`12. Desenhar label com cor base+(228-base)*tf (linhas 84-90)` 

`13. Desenhar color swatch e keybind se presentes (linhas 92-98)` 

`14. PopID (linha 100)` 

`15. Retornar *v && keybind_active(kb) (linha 101)` 

```
18.4 - Slider (slider.cpp:22-174)
Tres variantes: slider_float, slider_int, slider_range_int.
```

```
Layout: Label Text |=====O=========|  valor
                  track   knob
```

```
slider_float (slider.cpp:68-76):
   bool slider_float(const char* label, float* v, float vmin, float vmax,
                     const char* fmt) {
       if (!search::matches(label)) return false;
       PushID(label);
       char disp[32]; snprintf(disp,sizeof(disp),fmt,*v);
       bool active = base(label, v, vmin, vmax, disp);
       PopID(); return active;
   }
```

```
slider_int (slider.cpp:78-90): converte int<->float, arredonda.
```

```
slider_range_int (slider.cpp:159-174): dois handles (lo/hi).
```

```
base() (slider.cpp:22-66):
```

`1. InvisibleButton("##s",{avail,total_h}) (linha 28)` 

`2. Se active, calcula fracao pelo mouse X (linhas 38-43)` 

`3. Clamps e calculo de fracao/knob_x (linhas 44-49)` 

`4. Desenha label com cor hover (linha 54)` 

`5. Desenha valor alinhado a direita (linha 56)` 

`6. Track fundo AddRectFilled (linha 58)` 

`7. Track preenchida ate knob (accent) (linhas 59-61)` 

`8. Knob circular AddCircleFilled, raio=KNOB_R=7 (linha 63)` 

```
base_range() (slider.cpp:92-157): dois knobs com selecao de handle:
   ImGuiID hid = GetID("##handle");
   int handle = st->GetInt(hid, -1);
   if (clicked) handle = (fabsf(m.x-xlo) <= fabsf(m.x-xhi)) ? 0 : 1;
   if (!active) handle = -1;
```

```
   st->SetInt(hid, handle);
```

```
18.5 - Dropdown (dropdown.cpp:28-360)
Dois: dropdown (unica) e multi_dropdown (multipla).
```

```
dropdown() (dropdown.cpp:28-172):
```

`1. PushID, search::matches, InvisibleButton (linhas 29-39)` 

`2. Estados opened/popup_hov no ImGuiStorage (linhas 52-55)` 

`3. Toggle: click na box abre, click fora fecha (linha 57-58)` 

`4. Animacoes ot/bh (linhas 60-61)` 

`5. Desenha label, box, texto selecionado, seta rotacionada (linhas 65-92)` 

`6. Seta: 2 linhas com rotacao por ang=PI*ot (linhas 80-92)` 

`7. Se aberto, Begin com nome "##ddpop_"+label (linhas 113-117)` 

`8. PushClipRect para animacao de revelacao (linha 122)` 

`9. Fundo/borda do popup com fade (mod()) (linhas 125-126)` 

`10. Para cada item: hover detectado por mp, animacao via ease (linhas 131-155)` 

`11. Clique seleciona item e fecha (linhas 134-137)` 

`12. PopID, estado salvo (linha 168)` 

```
multi_dropdown() (dropdown.cpp:174-359):
Mesma estrutura mas:
```

- `Alterna selected[i] em vez de setar *selected` 

- `Summary: itens selecionados separados por virgula` 

- `Se texto > largura, trunca com "..." (linhas 244-259)` 

```
18.6 - TextInput (textinput.cpp:58-167)
Entrada de texto animada com ghost e caret.
```

```
Parametros: label, buf (char*), buf_size, placeholder
```

```
Fluxo:
```

`1. PushID, search::matches (linhas 59-60)` 

`2. InvisibleButton, hover detection (linha 69-70)` 

`3. Foco gerenciado por g_focused global (linhas 81-86)` 

`4. state_t: anims[] (opacidade letra) e ghosts[] (backspace animado) (linhas 8791)` 

`5. Processa InputQueueCharacters, com limites ASCII 32-127 (linhas 97-104)` 

`6. Backspace com ghost (linhas 106-113)` 

`7. Animacao dos caracteres: s.anims[i] += (1-f)*dt*speed (linhas 120-121)` 

`8. Ghost fade out (linhas 122-125)` 

`9. Animacoes ft (foco) e ht (hover) no storage (linhas 127-129)` 

`10. Desenho: label (linha 133), box AddRectFilled com rnd=5 (linha 136)` 

`11. Borda lerp_col com ht+ft (linhas 137-139)` 

`12. Placeholder se vazio (linha 145)` 

`13. Caracteres com draw_scaled_char (linhas 148-152)` 

`14. Ghost characters (linhas 153-154)` 

`15. Caret piscante (fmodf(time,1)<0.5) com accent (linhas 156-162)` 

```
draw_scaled_char() (textinput.cpp:38-56):
```

```
   void draw_scaled_char(ImDrawList* dl, float x, float y, char c, ImU32 col,
float anim) {
```

```
       float eased = anim*anim*(3-2*anim); // smoothstep
       char b[2]={c,'\0'};
       ImVec2 sz=CalcTextSize(b);
       float cxc=x+sz.x*0.5f, cyc=y+sz.y*0.5f;
       int vtx_start = dl->VtxBuffer.Size;
```

```
       dl->AddText({x,y}, col, b);  // gera vertices normais
       int vtx_end = dl->VtxBuffer.Size;
```

- `ImDrawVert* verts = dl->VtxBuffer.Data; for (int v=vtx_start; v<vtx_end; v++) { verts[v].pos.x = cxc+(verts[v].pos.x-cxc)*eased; // escala X verts[v].pos.y = cyc+(verts[v].pos.y-cyc)*eased; // escala Y int a=(int)(((verts[v].col>>IM_COL32_A_SHIFT)&0xFF)*eased); verts[v].col = (verts[v].col&~IM_COL32_A_MASK)| ((ImU32)a<<IM_COL32_A_SHIFT); } }` 

```
Exemplo de manipulacao direta de vertices pos-AddText.
```

```
18.7 - Button (button.cpp:21-65)
Botao com hover glow e click flash.
```

`1. PushID, InvisibleButton (linhas 23, 29)` 

`2. hovered, held, clicked (linhas 30-32)` 

`3. ht (hover), pr (press), flash id (linhas 35-42)` 

`4. Click flash: cv=1 ao clicar, decai com speed=6 (linhas 39-42)` 

`5. Fundo: fill=25+6*ht-4*pr, AddRectFilled (linhas 50-51)` 

`6. Borda: lerp_col com fmaxf(0.30f*ht, cv) (linhas 53-55)` 

`7. Texto centralizado: lerp_col com cv (linhas 57-61)` 

```
18.8 - Keybind (keybind.cpp)
Configuracao de atalhos de teclado.
```

```
keybind_t: int key, int mode (0=Always,1=Hold,2=Toggle), bool toggle_state,
prev_down
```

```
keybind() (keybind.cpp:289-362):
```

`1. Desenha label e box (linhas 321-330)` 

`2. Desenha nome da tecla ou icon+kn (linhas 332-350)` 

`3. Chama run_picker() (linha 358)` 

```
run_picker() (keybind.cpp:124-287):
```

`1. Popup na ForegroundDrawList com animacao (linhas 172-181)` 

`2. 3 modos: Always/Hold/Toggle com botoes (linhas 183-208)` 

`3. Area de captura (listening) (linhas 210-230)` 

`4. Listening: detecta tecla via GetAsyncKeyState e prev_down (linhas 234-274)` 

- `Esc/Insert limpa key (linha 243)` 

- `Mouse clicks: io.MouseClicked[i] (linhas 250-257)` 

- `Teclado: loop 8..256, GetAsyncKeyState + prev_down (linhas 260-271)` 

```
keybind_icon() (keybind.cpp:364-405): icone compacto para checkbox.
```

```
update_binds() (keybind.cpp:104-113): chamado em gui.cpp:35, le estado real.
```

```
18.9 - ColorEdit (color_edit.cpp)
Edicao de cor HSV com alpha e cor secundaria.
```

```
color_edit() (linha 578): chama color_edit_impl com has_alpha=true.
color_edit3() (linha 582): converte float[3] para [4] com alpha=1.
```

```
run_color_picker() (color_edit.cpp:189-531):
```

```
Popup na ForegroundDrawList com:
```

- `Area SV: gradiente multi-color (linhas 325-328) AddRectFilledMultiColor com white->pure e clear->black` 

- `Barra H: 6 segmentos gradiente (linhas 412-431)` 

- `Barra A: checker + gradiente (linhas 433-463)` 

- `Display hex: #RRGGBBAA (linhas 466-510)` 

- `Cor secundaria: connection line Bezier (linhas 338-390)` 

- `Drag areas: sv drag=1, h drag=2, a drag=3, sec drag=4` 

```
draw_checker() (color_edit.cpp:99-113): padrao xadrez para alpha.
draw_checker_circle() (color_edit.cpp:115-144): xadrez circular.
draw_swatch() (color_edit.cpp:146-187): circulo com cor ou dividido.
```

```
18.10 - Resumo
```

- `Widgets nativos: Text, Button, Checkbox, Slider, Input, Combo, ColorEdit, etc.` 

- `Widgets Splinter em elements/widgets/` 

- `Checkbox: toggle animado com kb/color (checkbox.cpp:16-102)` 

- `Slider: float/int/range com track e knob (slider.cpp:22-174)` 

- `Dropdown: unico/multiplo com popup animado (dropdown.cpp:28-360)` 

- `TextInput: caracteres animados com ghost (textinput.cpp:58-167)` 

- `Button: hover glow, click flash (button.cpp:21-65)` 

- `Keybind: picker com listening mode (keybind.cpp)` 

- `ColorEdit: HSV picker, alpha, secundaria (color_edit.cpp)` 

```
===============================================================================
CAPITULO 19: ORGANIZACAO DE INTERFACES GRANDES
```

```
19.1 - Abas (Tabs)
```

```
O Splinter implementa sistema de abas customizado (nao usa TabBar nativo).
19.1.1 - struct Tab (tabs.h:8-13)
   struct Tab {
       const char* name;       // Nome exibido
       const char* icon;       // Icone Font Awesome
       void (*render)(float x, float y, float w, float h);  // Callback
   };
19.1.2 - Registro de Abas (tabs.cpp:4-9)
   static Tab list[] = {
       { "Combat",  ICON_COMBAT,  render_combat },
       { "Visuals", ICON_VISUALS, render_visuals },
       { "Misc",    ICON_MISC,    render_misc },
       { "Settings",ICON_SETTINGS,render_settings },
   };
Novas abas adicionadas inserindo entrada no array. Icones em tabs.h:
   #define ICON_COMBAT   "\xEF\x80\x98"
   #define ICON_VISUALS  "\xEF\x80\x80"
   #define ICON_MISC     "\xEF\x80\x84"
   #define ICON_SETTINGS "\xEF\x80\x8E"
19.1.3 - Renderizacao das Abas (gui.cpp:103-157)
Abas desenhadas na BackgroundDrawList como "pill" (capsula) inferior:
```

```
   // Calculo de larguras com animacao
   for (int i=0; i<n; i++) {
       float target = (active_tab==i) ? 1.0f : 0.0f;
       tab_anim[i] += (target - tab_anim[i]) * (1-expf(-dt*12));
       float base = icon_pad + icon_w[i] + icon_pad;
       float extra = label_gap + name_w + label_pad - icon_pad;
       seg_w[i] = base + tab_anim[i] * extra;  // largura animada
   }
```

```
   // Pill background
   bg->AddRectFilled(pill_min, pill_max, IM_COL32(25,24,30,255), pill_h*0.5f);
```

```
Cada aba e InvisibleButton; clique altera active_tab (gui.cpp:132-133).
Cor interpola para accent quando ativa. Nome aparece com fade-in.
```

```
19.1.4 - Renderizacao do Conteudo (gui.cpp:161-166)
   splinter::tabs::get(active_tab).render(
       panel_x+20, panel_y+header_bar_h+16,
       panel_w-40, panel_h-header_bar_h-16-pill_h-pad-12);
```

```
19.2 - Layout com Secoes (section function em combat.cpp:64-93)
   static void section(int id, const char* title,
       float x, float y, float w, float h,
       const std::function<void()>& content) {
       float rounding=8, bar_h=34;
       ImDrawList* dl = ImGui::GetWindowDrawList();
       soft_shadow(dl, x, y, x+w, y+h, rounding, 12, 45);
       dl->AddRectFilled({x,y},{x+w,y+h}, IM_COL32(22,21,27,255), rounding);
       dl->AddRectFilled({x,y},{x+w,y+bar_h}, IM_COL32(25,24,30,255),
           rounding, ImDrawFlags_RoundCornersTop);
       dl->AddLine({x+1,y+bar_h},{x+w-1,y+bar_h}, IM_COL32(30,30,30,255), 1);
       dl->AddRect({x,y},{x+w,y+h}, IM_COL32(30,30,30,255), rounding,0,1);
       if (title && title[0]) {
           dl->AddText({x+12, y+(bar_h-th)*0.5f}, IM_COL32(255,255,255,255),
title);
       }
       float inner_pad=12;
       PushStyleColor(ImGuiCol_ChildBg, ImVec4(0,0,0,0));
```

```
       SetCursorScreenPos({x+inner_pad, y+bar_h});
       PushID(id);
       BeginChild("##section",{w-inner_pad*2, h-bar_h},
           ImGuiChildFlags_None, ImGuiWindowFlags_NoScrollbar);
       Dummy({0,6});
       if (content) content();
       EndChild(); PopID(); PopStyleColor();
   }
19.3 - Layout em Colunas (combat.cpp:95-114)
   void render_combat(float x, float y, float w, float h) {
       float gap=14, col_w=(w-gap)*0.5f, half_h=(h-gap)*0.5f;
       float x2 = x+col_w+gap;
       section(0, "Section", x, y, col_w, h, []() {
           widgets::checkbox(...);
           widgets::slider_float(...);
           widgets::dropdown(...);
       });
       section(1, "Section", x2, y, col_w, half_h, nullptr);
       section(2, "Section", x2, y+half_h+gap, col_w, half_h, nullptr);
   }
Layout: [Secao0 total altura] [Secao1 meia altura]
                               [Secao2 meia altura]
```

```
19.4 - Padding e Margens Centralizadas (gui.cpp:52-59)
   float margin_left=40, margin_right=240;
   float margin_top=60, margin_bottom=50;
   float panel_x=margin_left, panel_y=margin_top;
   float panel_w=width-margin_left-margin_right;
   float panel_h=height-margin_top-margin_bottom;
```

```
Valores armazenados em window.h para acesso global.
Widgets usam GetContentRegionAvail().x para layout responsivo.
```

```
19.5 - Resumo
  - Abas: struct Tab (tabs.h:8-13), registro em array (tabs.cpp:4-9)
  - Abas renderizadas como pill animada na BackgroundDrawList
  - Secoes: section() com sombra, header, child (combat.cpp:64-93)
  - Colunas 50%-50% com gap (combat.cpp:95-114)
  - Margens centralizadas (gui.cpp:52-59)
```

```
CAPITULO 20: MENUS PROFISSIONAIS
```

```
20.1 - Menus Nativos da Dear ImGui
```

```
BeginMainMenuBar/EndMainMenuBar: barra no topo da viewport.
   if (ImGui::BeginMainMenuBar()) {
       if (ImGui::BeginMenu("File")) {
           if (ImGui::MenuItem("Open", "Ctrl+O")) { }
           ImGui::EndMenu();
       }
       ImGui::EndMainMenuBar();
   }
```

```
BeginMenuBar/EndMenuBar: barra dentro de janela (requer flag MenuBar).
MenuItem: bool MenuItem(label, shortcut, selected, enabled).
```

```
20.2 - Menu Customizado do Splinter
Splinter NAO usa menus nativos. Implementa menu customizado com:
```

```
20.2.1 - Background (gui.cpp:66-94)
Painel escuro com cantos arredondados, header, linha separadora, borda.
```

```
20.2.2 - Header (gui.cpp:73-80, 159)
Altura fixa=50px, fundo ligeiramente mais claro.
Search bar no canto direito:
   splinter::search::render(panel_x+panel_w-pad, panel_y, header_bar_h);
```

```
20.2.3 - Abas (gui.cpp:103-157)
Pill inferior com icones e nomes animados.
```

```
20.2.4 - Search Bar (search.cpp:28-108)
Animacao de foco, icone com cor interpolada, placeholder, caret piscante.
Processamento de InputQueueCharacters, backspace, escape.
```

```
20.2.5 - Filtro search::matches() (search.cpp:14-26)
   bool matches(const char* text) {
```

```
       if (query[0]==0) return true;
       char a[128], b[256];
       // converter ambos para lowercase
       // strstr case-insensitive
       return strstr(b, a) != nullptr;
   }
```

```
Cada widget chama matches() no inicio; se false, widget nao renderizado.
```

```
20.3 - Watermark (watermark.cpp:35-81)
Renderizado na ForegroundDrawList sobre tudo:
   void render(float panel_x, float panel_y, float panel_w, float panel_h) {
       if (!visible) return;
```

```
       // Relogio: time_t + localtime_s, formato 12h am/pm
       // Secoes: clock, "1 FPS", "1 MS"
```

- `// Fundo: AddRectFilled com 12px rounding` 

- `// Brand + suffix (accent) // Separadores verticais entre secoes }` 

```
Anchor positions (watermark.cpp:19-33):
   anchor_pos() calcula posicao baseada no tipo de ancora:
   AboveRight, AboveLeft, BelowRight, BelowLeft,
   RightTop, LeftTop, Free (free_x/free_y).
```

# `20.4 - Resumo` 

- `Menus nativos: BeginMainMenuBar, BeginMenuBar, MenuItem, BeginMenu` 

- `Splinter nao usa menus nativos; implementa menu customizado` 

- `Search bar: animacao, placeholder, caret, filtro (search.cpp:28-108)` 

- `matches(): substring case-insensitive para filtrar widgets` 

- `Watermark: relogio, FPS, MS, 7 posicoes anchor (watermark.cpp:35-81)` 

```
CAPITULO 21: DOCKING E MULTI-VIEWPORT
```

# `21.1 - O Que e Docking?` 

```
Docking permite acoplar janelas umas nas outras, formando interface com abas
e paineis redimensionaveis (similar a Visual Studio/Photoshop).
```

```
Recursos: arrastar janela pela barra para acoplar, criar abas, dividir espaco,
janelas flutuantes, DockSpace.
```

- `21.2 - Habilitando Docking io.ConfigFlags |= ImGuiConfigFlags_DockingEnable; #define IMGUI_HAS_DOCK 1  // em imconfig.h` 

# `21.3 - Usando DockSpace` 

- `// DockSpace sobre toda a viewport ImGui::DockSpaceOverViewport(ImGui::GetMainViewport());` 

- `// DockSpace com ID especifico` 

```
   ImGuiID id = ImGui::GetID("MainDock");
   ImGui::DockSpace(id, ImVec2(0,0), ImGuiDockNodeFlags_None);
```

```
   // Exemplo completo
   ImGui::Begin("MainWindow", NULL, ImGuiWindowFlags_NoTitleBar);
   ImGui::DockSpace(ImGui::GetID("DS"));
   ImGui::End();
   ImGui::Begin("Scene"); ... ImGui::End();
   ImGui::Begin("Properties"); ... ImGui::End();
```

```
21.4 - ImGuiDockNodeFlags
   ImGuiDockNodeFlags_None = 0
   KeepAliveOnly = 1<<0
   NoDockingInCentralNode = 1<<2
   PassthruCentralNode = 1<<3
   NoSplit = 1<<4, NoResize = 1<<5
   AutoHideTabBar = 1<<6
```

# `21.5 - O Que e Multi-Viewport?` 

```
Multi-Viewport permite janelas ImGui sairem da janela principal e se tornarem
janelas independentes do SO. Cada viewport tem seu proprio HWND, suporte a
monitores diferentes, taskbar entries.
```

```
21.6 - Habilitando Multi-Viewport
   io.ConfigFlags |= ImGuiConfigFlags_ViewportsEnable;
   // Backend flags: ImGuiBackendFlags_PlatformHasViewports
   //                ImGuiBackendFlags_RendererHasViewports
```

```
No loop apos Render():
   if (io.ConfigFlags & ImGuiConfigFlags_ViewportsEnable) {
       ImGui::UpdatePlatformWindows();
       ImGui::RenderPlatformWindowsDefault();
   }
```

```
21.7 - NOTA: Splinter nao usa Docking/Multi-Viewport propositalmente
Razoes:
```

`1. Interface fixa: menu overlay sobre o jogo; viewports quebrariam.` 

`2. Design unificado: layout fixo com abas; usuario nao deve reorganizar.` 

`3. Performance: recursos adicionais para cada viewport.` 

`4. Controle visual: BackgroundDrawList/ForegroundDrawList ficariam complexos.` 

`5. Simplicidade: publico-alvo nao precisa reorganizar interface.` 

```
Para habilitar no Splinter (se desejado):
```

```
   // imconfig.h: #define IMGUI_HAS_DOCK 1; #define IMGUI_HAS_VIEWPORT 1
   // main.cpp: io.ConfigFlags |= DockingEnable | ViewportsEnable;
```

```
   // apos Render(): UpdatePlatformWindows(); RenderPlatformWindowsDefault();
```

# `21.8 - Resumo` 

- `Docking: acoplar janelas (ImGuiConfigFlags_DockingEnable)` 

- `DockSpaceOverViewport / DockSpace para area de docking` 

- `Multi-Viewport: janelas fora da main (ViewportsEnable)` 

- `Requer UpdatePlatformWindows / RenderPlatformWindowsDefault` 

- `Splinter NAO usa docking/viewport propositalmente (interface fixa)` 

```
CAPITULO 22: ImDrawList - DESENHO PERSONALIZADO
```

```
22.1 - Introducao ao ImDrawList
ImDrawList e a interface para desenho 2D. Todos os widgets a usam internamente.
```

```
Obtencao:
```

```
   ImDrawList* dl  = ImGui::GetWindowDrawList();      // janela atual
   ImDrawList* bg  = ImGui::GetBackgroundDrawList();   // fundo
   ImDrawList* fg  = ImGui::GetForegroundDrawList();   // frente
```

# `22.2 - Metodos de Primitivas` 

# `22.2.1 - AddRectFilled` 

```
   void AddRectFilled(p_min, p_max, col, rounding=0, ImDrawFlags=0);
Retangulo preenchido.
```

```
   bg->AddRectFilled({panel_x,panel_y},{panel_x+panel_w,panel_y+panel_h},
       IM_COL32(22,21,27,255), corner_radius); // gui.cpp:66-71
```

```
   bg->AddRectFilled({..., ImDrawFlags_RoundCornersTop); // gui.cpp:73-80
```

# `22.2.2 - AddRectFilledMultiColor` 

```
   void AddRectFilledMultiColor(p_min, p_max, colUL, colUR, colBR, colBL);
Gradiente de 4 cores.
```

```
   // color_edit.cpp:325-328 - gradiente SV
   pdl->AddRectFilledMultiColor({sv_x,sv_y},{sv_x+sv_w,sv_y+sv_h},
       mod(white), mod(pure), mod(pure), mod(white));
   pdl->AddRectFilledMultiColor({sv_x,sv_y},{sv_x+sv_w,sv_y+sv_h},
       mod(clear), mod(clear), mod(black), mod(black));
```

```
   // color_edit.cpp:423-424 - barra Hue
   pdl->AddRectFilledMultiColor({hb_x,y0},{hb_x+bar_w,y1},
       mod(hstops[i]),mod(hstops[i]),mod(hstops[i+1]),mod(hstops[i+1]));
```

# `22.2.3 - AddCircleFilled` 

```
   void AddCircleFilled(center, radius, col, num_segments=0);
Circulo preenchido.
```

```
   dl->AddCircleFilled({cx,cy}, cd*0.5f, IM_COL32(cr,cg,cb,255), 24); //
checkbox.cpp:82
```

```
   // color_edit.cpp:332-336 - cursor do color picker (3 aneis)
   pdl->AddCircleFilled({mx_,my_}, 6, mod(IM_COL32(0,0,0,90)), 20);
   pdl->AddCircle({mx_,my_}, 6, mod(IM_COL32(255,255,255,255)), 24, 1.5f);
   pdl->AddCircle({mx_,my_}, 5, mod(IM_COL32(0,0,0,180)), 24, 1.0f);
   pdl->AddCircleFilled({mx_,my_}, 3, mod(IM_COL32(cr,cg,cb,255)), 14);
```

# `22.2.4 - AddLine` 

```
   void AddLine(p1, p2, col, thickness=1.0f);
Linha entre dois pontos.
```

```
   bg->AddLine({panel_x,panel_y+header_bar_h},
```

```
       {panel_x+panel_w,panel_y+header_bar_h}, IM_COL32(30,30,30,255), 1); //
gui.cpp:81-86
```

```
   dl->AddLine(pl, pm, arrow_col, 1.7f); // dropdown.cpp:91 - seta
```

```
   pdl->AddLine(prev, {bx,by}, mod(IM_COL32(0,0,0,110)), 2); //
color_edit.cpp:373
```

```
   dl->AddLine({caret_x,ty+2},{caret_x,ty+line_h-2}, IM_COL32(230,230,235,255),
1); // search.cpp:105
```

# `22.2.5 - AddRect` 

```
   void AddRect(p_min, p_max, col, rounding=0, ImDrawFlags=0, thickness=1);
Retangulo com borda (apenas contorno).
```

```
   bg->AddRect({panel_x,panel_y},{panel_x+panel_w,panel_y+panel_h},
       IM_COL32(30,30,30,255), corner_radius, 0, 1); // gui.cpp:87-94
```

```
   dl->AddRect({x,y},{x+w,y+h}, IM_COL32(30,30,30,255), rounding, 0, 1); //
combat.cpp:75
```

```
22.2.6 - AddCircle
```

```
   void AddCircle(center, radius, col, num_segments=0, thickness=1);
Circulo com borda.
```

```
   pdl->AddCircle({mx_,my_}, 6, mod(IM_COL32(255,255,255,255)), 24, 1.5f); //
color_edit.cpp:333
```

```
   pdl->AddCircle({mx_,my_}, 5, mod(IM_COL32(0,0,0,180)), 24, 1.0f); //
color_edit.cpp:334
```

```
22.2.7 - AddBezierCubic / AddBezierQuadratic
Curvas Bezier cubicas (4 pontos) ou quadraticas (3 pontos).
```

```
A connection line no color_edit.cpp:358-367 implementa Bezier manualmente:
   float bcx = (mx_+sxsec)*0.5f + perp_x*base_bow;
   float bcy = (my_+sysec)*0.5f + perp_y*base_bow;
   float bx = it*it*mx_ + 2*it*t*bcx + t*t*sxsec;
   float by = it*it*my_ + 2*it*t*bcy + t*t*sysec;
   float wave = sinf(t*3.14159f*2.5f - time*3.0f) * (len*0.04f) *
sinf(t*3.14159f);
```

```
   bx += perp_x*wave; by += perp_y*wave;
   pdl->AddLine(prev, {bx,by}, mod(IM_COL32(0,0,0,110)), 2); // linha com onda
```

# `22.2.8 - AddText` 

```
   void AddText(font, font_size, pos, col, text_begin, text_end=NULL,
                wrap_width=0, cpu_fine_clip_rect=NULL);
Desenha texto na posicao especificada.
```

```
   dl->AddText({floorf(sx1+10), floorf(ty)}, IM_COL32(lr,lg,lb,255), label); //
checkbox.cpp:90
```

```
   bg->AddText(icons, icon_size, {icon_x,icon_y}, IM_COL32(r,g,b,255), icon); //
gui.cpp:144
```

```
   dl->AddText(splinter::assets::icons, ImGui::GetFontSize(),
```

```
       {floorf(bx0+8), kty}, kcol, icon); // keybind.cpp:343 (com PushFont)
```

# `22.2.9 - AddImage` 

```
   void AddImage(texture_id, p_min, p_max, uv_min=ImVec2(0,0),
                 uv_max=ImVec2(1,1), col=IM_COL32_WHITE);
Desenha uma textura (ex: de um jogo ou captura de tela).
```

```
Nao usado no Splinter, mas disponivel para renderizar texturas.
```

```
22.3 - Gradientes (color_edit.cpp:325-328)
```

```
Gradientes sao feitos com AddRectFilledMultiColor. Exemplo do SV area:
```

```
   // Primeiro: gradiente horizontal (branco -> cor pura)
```

```
   pdl->AddRectFilledMultiColor({sv_x,sv_y},{sv_x+sv_w,sv_y+sv_h},
       mod(white), mod(pure), mod(pure), mod(white));
```

```
   // Segundo: gradiente vertical (transparente -> preto)
   pdl->AddRectFilledMultiColor({sv_x,sv_y},{sv_x+sv_w,sv_y+sv_h},
       mod(clear), mod(clear), mod(black), mod(black));
```

```
Isso cria o efeito SV: canto superior esquerdo = branco,
superior direito = cor pura, inferior direito = preto.
```

```
22.4 - Soft Shadow (combat.cpp:23-62)
Descrito em detalhe no capitulo 11.5.
Usa PrimReserve/PrimWriteVtx/PrimWriteIdx com gradiente alpha.
4 quads retangulares + 4 cantos com 14 segmentos cada.
```

```
22.5 - Checker Pattern (color_edit.cpp:99-112)
Padrao xadrez para indicar transparencia:
```

```
   static void draw_checker(ImDrawList* dl, float x0, float y0,
```

```
                            float x1, float y1, float cs) {
       dl->AddRectFilled({x0,y0},{x1,y1}, IM_COL32(200,200,200,255));
       ImU32 dark = IM_COL32(140,140,140,255);
       for (float yy=y0; yy<y1; yy+=cs)
           for (float xx=x0; xx<x1; xx+=cs)
               if ((((int)((xx-x0)/cs)+(int)((yy-y0)/cs))&1)==0) {
                   float xe=xx+cs; if(xe>x1) xe=x1;
                   float ye=yy+cs; if(ye>y1) ye=y1;
                   dl->AddRectFilled({xx,yy},{xe,ye}, dark);
               }
   }
```

```
xadrez de dois tons (200,200,200) e (140,140,140). Usado na barra de alpha.
draw_checker_circle() (color_edit.cpp:115-144): versao circular para swatches.
```

```
22.6 - PrimReserve/PrimWriteVtx/PrimWriteIdx - Acesso Direto ao Buffer
Metodos de baixo nivel para escrever vertices e indices diretamente.
```

```
   // combat.cpp:29-38 - lambda q() do soft_shadow
   auto q = [&](ImVec2 p0, ImVec2 p1, ImVec2 p2, ImVec2 p3,
                ImU32 c0, ImU32 c1, ImU32 c2, ImU32 c3) {
       dl->PrimReserve(6, 4);  // 6 indices, 4 vertices
       ImDrawIdx i = (ImDrawIdx)dl->_VtxCurrentIdx;
       dl->PrimWriteVtx(p0, uv, c0);
       dl->PrimWriteVtx(p1, uv, c1);
       dl->PrimWriteVtx(p2, uv, c2);
       dl->PrimWriteVtx(p3, uv, c3);
       dl->PrimWriteIdx(i);   dl->PrimWriteIdx(i+1); dl->PrimWriteIdx(i+2);
       dl->PrimWriteIdx(i);   dl->PrimWriteIdx(i+2); dl->PrimWriteIdx(i+3);
   };
```

```
Parametros PrimReserve(idx_count, vtx_count):
  idx_count: numero de indices a reservar
  vtx_count: numero de vertices a reservar
```

```
PrimWriteVtx(pos, uv, col): escreve um vertice no proximo slot.
PrimWriteIdx(idx): escreve um indice no proximo slot.
```

```
Usado para geometria que nao pode ser expressa com Add* simples.
```

```
22.7 - Manipulacao de Vertices apos AddText (textinput.cpp:49-55)
Apos chamar AddText, e possivel modificar os vertices gerados:
```

```
   int vtx_start = dl->VtxBuffer.Size;
   dl->AddText({x, y}, col, b);  // gera vertices
   int vtx_end = dl->VtxBuffer.Size;
```

```
   ImDrawVert* verts = dl->VtxBuffer.Data;
   for (int v=vtx_start; v<vtx_end; v++) {
       verts[v].pos.x = cxc + (verts[v].pos.x-cxc) * eased;  // escala em X
       verts[v].pos.y = cyc + (verts[v].pos.y-cyc) * eased;  // escala em Y
       int a = (int)(((verts[v].col >> IM_COL32_A_SHIFT) & 0xFF) * eased);
       verts[v].col = (verts[v].col & ~IM_COL32_A_MASK) | ((ImU32)a <<
IM_COL32_A_SHIFT);
   }
```

```
Tecnica usada para animar caracteres individualmente no TextInput.
```

```
22.8 - Desenho de Swatch Dividido (color_edit.cpp:168-182)
Usa PrimReserve para criar gradiente radial entre duas cores:
```

```
   dl->PrimReserve(segs*3, segs+1);
   ImDrawIdx base = (ImDrawIdx)dl->_VtxCurrentIdx;
```

```
   dl->PrimWriteVtx({cx, cy}, uv, lerp_col(c1, c2, 0.5f));  // centro
   for (int i=0; i<segs; i++) {
       float ang=(float)i/segs*6.28318531f;
       float ex=cx+cosf(ang)*radius, ey=cy+sinf(ang)*radius;
       float t=((ex-cx)/radius+1.0f)*0.5f;
       dl->PrimWriteVtx({ex,ey}, uv, lerp_col(c1, c2, t));
   }
   for (int i=0; i<segs; i++) {  // triangulos
       dl->PrimWriteIdx(base);
       dl->PrimWriteIdx((ImDrawIdx)(base+1+i));
       dl->PrimWriteIdx((ImDrawIdx)(base+1+((i+1)%segs)));
   }
```

# `22.9 - Resumo` 

- `AddRectFilled: retangulo preenchido (gui.cpp, combat.cpp)` 

- `AddRectFilledMultiColor: gradiente 4 cores (color_edit.cpp:325-328)` 

- `AddCircleFilled/AddCircle: circulo e aneis (color_edit.cpp:332-336)` 

- `AddLine: linhas retas (gui.cpp, dropdown.cpp, search.cpp)` 

- `AddRect: contorno (gui.cpp, combat.cpp)` 

- `AddBezierCubic/Quadratic: curvas (color_edit.cpp:358-367)` 

- `AddText: texto com fonte (checkbox.cpp, gui.cpp, keybind.cpp)` 

- `AddImage: textura (nao usado no Splinter)` 

- `Soft shadow: PrimReserve/PrimWriteVtx/PrimWriteIdx (combat.cpp:23-62)` 

- `Checker pattern: xadrez para alpha (color_edit.cpp:99-112)` 

- `Modificacao de vertices pos-AddText (textinput.cpp:49-55)` 

- `PrimReserve/PrimWriteVtx/PrimWriteIdx: acesso direto ao buffer` 

```
================================================================================
CURSO COMPLETO DE DEAR IMGUI - Capitulos 23 a 35
```

```
================================================================================
```

```
===============================================================================
CAPITULO 23: WIDGETS PERSONALIZADOS
===============================================================================
```

```
23.1 - Introducao
```

```
-------------------
```

```
Embora a Dear ImGui ofereca dezenas de widgets prontos (Button, SliderFloat,
Checkbox, Combo, etc.), projetos profissionais como o Splinter frequentemente
precisam de widgets com aparencia e comportamento proprios. Criar widgets
personalizados e uma das habilidades mais importantes ao trabalhar com ImGui.
```

```
O Splinter implementa seus proprios widgets em:
   ext\menu\elements\widgets\
```

```
     checkbox\checkbox.cpp   - Checkbox com animacao toggle/knob
     slider\slider.cpp       - Slider com knob circular
     dropdown\dropdown.cpp   - Dropdown com animacao de abertura
     textinput\textinput.cpp - InputText com animacao de caracteres
     button\button.cpp       - Button com glow e ripple
     keybind\keybind.cpp     - Keybind com seletor de tecla
     color_edit\color_edit.cpp - ColorEdit com color picker completo
```

```
Todos estes widgets compartilham uma anatomia comum que vamos dissecar.
```

- `23.2 - Anatomia de um Widget Customizado (10 Passos)` 

```
------------------------------------------------------
```

```
Todo widget customizado na ImGui segue estes 10 passos. Vamos analisar cada
um com exemplos reais do Splinter.
```

```
PASSO 1: PushID
^^^^^^^^^^^^^^^^
```

```
Garante que o ID do widget seja unico no contexto atual. Sem PushID, widgets
```

```
com o mesmo label (ex: "##btn") entrariam em conflito.
```

```
   ImGui::PushID(label);   // checkbox.cpp:18
   // ou
   ImGui::PushID(i);       // para widgets em loop
```

```
PASSO 2: GetCursorScreenPos
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Obtem a posicao absoluta na tela onde o cursor de layout esta. Usamos esta
posicao para desenhar manualmente com o ImDrawList.
```

```
   ImVec2 pos = ImGui::GetCursorScreenPos();  // checkbox.cpp:20
```

```
PASSO 3: Calcular tamanho disponivel
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Usamos GetContentRegionAvail() para saber quanto espaco horizontal
esta disponivel na area de conteudo atual.
```

```
   float avail = ImGui::GetContentRegionAvail().x;  // checkbox.cpp:21
```

```
PASSO 4: InvisibleButton
^^^^^^^^^^^^^^^^^^^^^^^^^^
Cria uma area de interacao invisivel. Este e o coracao do sistema:
InvisibleButton registra um retangulo no layout e no sistema de interacao,
mas nao desenha nada visualmente. Nos mesmos desenhamos o visual.
```

```
   ImGui::InvisibleButton("##cb", { avail, row_h });  // checkbox.cpp:42
```

```
PASSO 5: Verificar estado (Hovered/Active/Clicked)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Apos InvisibleButton, podemos consultar o estado do item:
```

```
   bool hovered = ImGui::IsItemHovered();    // checkbox.cpp:43
   bool held    = ImGui::IsItemActive();     // button.cpp:31
   bool clicked = ImGui::IsItemClicked();    // button.cpp:32
```

```
Diagrama do sistema de estado de um item:
```

```
   [Frame N]          [Frame N+1]       [Frame N+2]
      |                   |                 |
      v                   v                 v
   Mouse sobre area? ---> IsItemHovered() = true
      |                   |
      v                   v
   Mouse click? --------> IsItemActive() = true (por varios frames)
      |                   |
      v                   v
   Mouse soltou? -------> IsItemClicked() = true (1 frame)
                           IsItemActive() = false
```

```
PASSO 6: ImGuiStorage para estado persistente
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Usamos ImGuiStorage para armazenar valores que persistem entre frames,
como valores de animacao. O Splinter usa isso extensivamente:
```

```
   ImGuiStorage* st = ImGui::GetStateStorage();        // button.cpp:34
   float ht = ease(st, ImGui::GetID("##h"),            // button.cpp:35
               hovered ? 1.0f : 0.0f, 16.0f);
```

```
PASSO 7: Obter o DrawList
^^^^^^^^^^^^^^^^^^^^^^^^^^^
Obtemos o ImDrawList da janela atual (ou foreground/background) para
desenhar nossos graficos:
```

```
   ImDrawList* dl = ImGui::GetWindowDrawList();  // checkbox.cpp:60
```

```
PASSO 8: Desenhar com AddRectFilled, AddText, etc.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Usamos as funcoes do ImDrawList para criar a aparencia visual do widget:
```

```
   dl->AddRectFilled({ sx0, sy0 }, { sx1, sy1 },     // checkbox.cpp:69
       IM_COL32(36, 35, 42, 255), rounding);
   dl->AddCircleFilled({ cx, cy }, cd * 0.5f,          // checkbox.cpp:82
       IM_COL32(cr, cg, cb, 255), 24);
   dl->AddText({ floorf(sx1 + 10.0f), floorf(ty) },    // checkbox.cpp:90
       IM_COL32(lr, lg, lb, 255), label);
```

```
PASSO 9: Processar interacao e modificar estado
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Verificamos cliques, arrastos, etc. e modificamos as variaveis de saida:
```

```
   if (ImGui::IsItemClicked() && !on_kb && !on_col)   // checkbox.cpp:54
       *v = !*v;
```

```
PASSO 10: PopID e retornar resultado
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Sempre equilibramos o PushID com PopID, e retornamos um bool indicando
se o valor foi modificado:
```

```
   ImGui::PopID();            // checkbox.cpp:100
   return *v && (kb ? keybind_active(kb) : true);  // checkbox.cpp:101
```

```
23.3 - Exemplo Completo: Criar Widget Toggle Button do Zero
---------------------------------------------------------------
Vamos construir um widget toggle_button do inicio, seguindo os 10 passos.
Este widget sera um botao que alterna entre dois estados (ligado/desligado)
com animacao de cor e glow.
```

```
Arquivo: toggle_button.h (elements/widgets/toggle_button/)
```

```
   #pragma once
   #include "../../../../imgui/imgui.h"
```

```
   namespace splinter::widgets {
       bool toggle_button(const char* label, bool* v);
   }
```

```
Arquivo: toggle_button.cpp
```

```
   #include "toggle_button.h"
   #include "../../../theme/theme.h"
   #include "../../../search/search.h"
   #include "../../../../imgui/imgui.h"
   #include <cmath>
```

```
   namespace splinter::widgets {
       static float ease(ImGuiStorage* st, ImGuiID id, float target, float
speed) {
           float v = st->GetFloat(id, target);
           v += (target - v) * (1.0f - expf(-ImGui::GetIO().DeltaTime * speed));
           st->SetFloat(id, v);
           return v;
       }
       static ImU32 lerp_col(ImU32 a, ImU32 b, float t) {
           int ar = (a >> IM_COL32_R_SHIFT) & 0xFF;
           int ag = (a >> IM_COL32_G_SHIFT) & 0xFF;
           int ab = (a >> IM_COL32_B_SHIFT) & 0xFF;
```

```
           int aa = (a >> IM_COL32_A_SHIFT) & 0xFF;
           int br = (b >> IM_COL32_R_SHIFT) & 0xFF;
           int bg = (b >> IM_COL32_G_SHIFT) & 0xFF;
           int bb = (b >> IM_COL32_B_SHIFT) & 0xFF;
           int ba = (b >> IM_COL32_A_SHIFT) & 0xFF;
           return IM_COL32(
               (int)(ar + (br - ar) * t),
               (int)(ag + (bg - ag) * t),
               (int)(ab + (bb - ab) * t),
               (int)(aa + (ba - aa) * t)
           );
       }
       bool toggle_button(const char* label, bool* v) {
           if (!splinter::search::matches(label))
               return false;
           ImGui::PushID(label);
           ImVec2 pos = ImGui::GetCursorScreenPos();
           float avail = ImGui::GetContentRegionAvail().x;
           float h = 32.0f;
           float w = ImGui::CalcTextSize(label).x + 60.0f;
           if (w > avail) w = avail;
           ImGui::InvisibleButton("##tb", { w, h });
           bool hovered = ImGui::IsItemHovered();
           bool clicked = ImGui::IsItemClicked();
           if (clicked) *v = !*v;
           ImGuiStorage* st = ImGui::GetStateStorage();
           float ta = ease(st, ImGui::GetID("##state"), *v ? 1.0f : 0.0f,
10.0f);
           float ha = ease(st, ImGui::GetID("##hov"), hovered ? 1.0f : 0.0f,
16.0f);
           ImDrawList* dl = ImGui::GetWindowDrawList();
           float rnd = 6.0f;
           ImVec2 mn = { pos.x, pos.y };
           ImVec2 mx = { pos.x + w, pos.y + h };
           ImU32 bg_on = IM_COL32(
               splinter::theme::accent_r, splinter::theme::accent_g,
               splinter::theme::accent_b, 200);
           ImU32 bg_off = IM_COL32(36, 35, 42, 255);
           ImU32 bg_col = lerp_col(bg_off, bg_on, ta);
           dl->AddRectFilled(mn, mx, bg_col, rnd);
           ImU32 border = lerp_col(
               IM_COL32(35, 32, 38, 255),
               IM_COL32(splinter::theme::accent_r, splinter::theme::accent_g,
                        splinter::theme::accent_b, 255), ha * 0.6f);
           dl->AddRect(mn, mx, border, rnd, 0, 1.2f);
           ImU32 tcol = lerp_col(
               IM_COL32(200, 200, 208, 255),
               IM_COL32(255, 255, 255, 255), ta);
           ImVec2 ts = ImGui::CalcTextSize(label);
           float tx = floorf(pos.x + (w - ts.x) * 0.5f);
           float ty = floorf(pos.y + (h - ts.y) * 0.5f);
           dl->AddText({ tx, ty }, tcol, label);
           float dot_r = 4.0f;
           float dot_x = mx.x - 16.0f;
           float dot_y = pos.y + h * 0.5f;
           ImU32 dot_col = lerp_col(
               IM_COL32(150, 150, 158, 255),
               IM_COL32(80, 255, 80, 255), ta);
           dl->AddCircleFilled({ dot_x, dot_y }, dot_r, dot_col, 12);
           ImGui::PopID();
           return clicked;
       }
   }
```

```
23.4 - Como Adicionar Widgets ao Projeto Splinter
-----------------------------------------------------
Para adicionar um novo widget ao Splinter, siga estas etapas:
```

```
ETAPA 1: Criar a pasta do widget
   Crie uma nova subpasta em ext\menu\elements\widgets\:
      ext\menu\elements\widgets\toggle_button\
```

```
ETAPA 2: Criar os arquivos .h e .cpp
   toggle_button.h   - Declaracao da funcao publica
   toggle_button.cpp - Implementacao completa
```

```
ETAPA 3: Incluir em widgets.h
   Edite ext\menu\elements\widgets\widgets.h:
      #pragma once
      #include "checkbox/checkbox.h"
      #include "slider/slider.h"
      #include "dropdown/dropdown.h"
      #include "textinput/textinput.h"
      #include "button/button.h"
      #include "keybind/keybind.h"
      #include "color_edit/color_edit.h"
      #include "toggle_button/toggle_button.h"   // <-- NOVA LINHA
```

```
ETAPA 4: Adicionar ao vcxproj
   Edite splinter.vcxproj, adicione em <ClCompile>:
      <ClCompile
Include="ext\menu\elements\widgets\toggle_button\toggle_button.cpp" />
```

```
ETAPA 5: Usar nas abas
   #include "../elements/widgets/widgets.h"
   // ...
   ImGui::PushID(42);
   widgets::toggle_button("My Toggle", &my_var);
   ImGui::PopID();
```

```
23.5 - Padroes de Design para Widgets Reutilizaveis
```

```
-------------------------------------------------------
```

```
PADRAO 1: Early exit com search::matches
   Todos os widgets do Splinter comecam verificando se o label corresponde
   ao texto da busca. Se nao corresponder, retornam false imediatamente.
```

```
      if (!splinter::search::matches(label)) return false;  // button.cpp:22
```

```
PADRAO 2: PushID/PopID em torno de todo o widget
   Garante que o ID seja unico e que nao haja vazamento na pilha de IDs.
```

- `PADRAO 3: Nao misturar layout automatico com manual Widgets customizados usam posicoes calculadas (GetCursorScreenPos) mas respeitam o layout chamando InvisibleButton + ItemSize/ItemAdd.` 

```
PADRAO 4: Usar ImGuiStorage para estado entre frames
   Nao use variaveis static para estado de animacao de widgets
   individuais, pois isso quebraria com multiplas instancias do mesmo
   widget. Use ImGuiStateStorage com IDs unicos.
```

```
PADRAO 5: Funcoes auxiliares static no namespace
   Funcoes como ease() e lerp_col() sao definidas como static dentro
   de cada arquivo .cpp para evitar conflitos de nome.
```

- `PADRAO 6: Retornar bool indicando modificacao` 

```
   Todo widget retorna true se o valor foi alterado no frame atual.
```

```
PADRAO 7: Usar nomes com ## para IDs internos
```

```
   IDs que comecam com ## sao ocultos (nao aparecem em debug e no .ini).
```

```
23.6 - Dicas Avancadas
```

```
-------------------------
EARLY EXIT COM search::matches:
```

```
   O search::matches (search.cpp:14-26) compara o label do widget com o
   texto da barra de pesquisa. Se nao houver match, o widget nao e
   processado. Isso otimiza a interface quando o usuario esta filtrando.
```

```
ANIMACAO COM ease():
```

```
   A funcao ease (definida em checkbox.cpp:8-14) usa easing exponencial:
      v += (target - v) * (1.0f - expf(-ImGui::GetIO().DeltaTime * speed));
   Quanto maior speed, mais rapida a interpolacao.
```

```
CORES COM lerp_col():
```

```
   A funcao lerp_col (dropdown.cpp:22-26) interpola entre duas cores
   ImU32 usando um fator t (0..1). Usada para transicoes suaves de cor.
```

```
Diagrama: Estrutura de um Widget Customizado
```

```
   +-------------------------------------------------------+
   |                    Widget Customizado                  |
   |                                                       |
   |  1. if (!matches(label)) return false;  (early exit)  |
   |  2. PushID(label)                                     |
   |  3. pos = GetCursorScreenPos()                        |
   |  4. InvisibleButton("##id", {w, h})                   |
   |  5. hovered = IsItemHovered()                         |
   |      active  = IsItemActive()                         |
   |      clicked = IsItemClicked()                        |
   |  6. st = GetStateStorage()                            |
   |      anim = ease(st, id, target, speed)               |
   |  7. dl = GetWindowDrawList()                          |
   |  8. dl->AddRectFilled(...) / AddText(...)             |
   |  9. if (clicked) *v = !*v;                            |
   | 10. PopID(); return changed;                          |
   +-------------------------------------------------------+
```

```
===============================================================================
CAPITULO 24: ANIMACOES E TRANSICOES
```

```
===============================================================================
```

```
24.1 - Introducao
```

```
-------------------
Um dos diferenciais do Splinter em relacao a uma interface ImGui padrao
sao as animacoes suaves. Todos os widgets do Splinter possuem transicoes
animadas: checkbox com toggle deslizante, abas que expandem com o nome,
dropdowns que abrem com smoothstep, botoes com glow de hover, etc.
```

```
24.2 - Easing Exponencial (funcao ease())
-------------------------------------------
A funcao de easing mais usada no Splinter e o easing exponencial.
Ela faz a transicao suave entre um valor atual e um valor alvo.
```

```
Formula: v += (target - v) * (1 - e^(-dt * speed))
```

```
Implementacao (checkbox.cpp:8-14):
   static float ease(ImGuiID id, float target, float speed) {
       ImGuiStorage* st = ImGui::GetStateStorage();
       float v = st->GetFloat(id, target);
       v += (target - v) * (1.0f - expf(-ImGui::GetIO().DeltaTime * speed));
       st->SetFloat(id, v);
```

```
       return v;
   }
```

```
Caracteristicas:
```

```
   - Se target = v, v nao muda (estado estavel)
   - Se target != v, v converge exponencialmente
   - speed controla a velocidade: speed=8 (lento), speed=16 (medio), speed=20
(rapido)
   - O valor nunca alcanca target exatamente (assintotico)
```

```
Variacao com ImGuiStorage* externo:
   Alguns widgets do Splinter passam o storage explicitamente para usar
   storages diferentes (como o storage da popup window):
   static float ease(ImGuiStorage* st, ImGuiID id, float target, float speed) {
       float v = st->GetFloat(id, target);
       v += (target - v) * (1.0f - expf(-ImGui::GetIO().DeltaTime * speed));
       st->SetFloat(id, v);
       return v;
   }
   // Usado em: dropdown.cpp:10-15, button.cpp:8-13
```

```
24.3 - Smoothstep: t*t*(3-2t)
--------------------------------
O smoothstep e usado para animacoes que precisam de uma entrada e saida
suaves (aceleracao no inicio, desaceleracao no fim).
```

```
Formula: eased = t * t * (3.0f - 2.0f * t)
```

```
Implementacao (dropdown.cpp:103):
   float eased = ot * ot * (3.0f - 2.0f * ot);
```

```
Usado para:
```

```
   - Abertura de popup de dropdown (dropdown.cpp:103)
```

```
   - Abertura do color picker (color_edit.cpp:258)
```

```
   - Abertura do keybind picker (keybind.cpp:169)
```

```
   - Animacao de texto (textinput.cpp:39)
```

```
24.4 - Animacoes Especificas de Cada Widget
```

```
-----------------------------------------------
```

```
24.4.1 - Checkbox: animacao ta (toggle alpha) e tf (toggle knob)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo: checkbox.cpp:57-58
```

```
   float ta = ease(ImGui::GetID("##a"), *v ? 1.0f : 0.0f, 8.0f);
   // ta (toggle alpha): controla a opacidade do fundo colorido - lenta
```

```
   float tf = ease(ImGui::GetID("##b"), *v ? 1.0f : 0.0f, 16.0f);
   // tf (toggle knob): controla a posicao do knob deslizante - rapida
```

```
   O knob se move entre: cx = sx0 + indent + cd*0.5f + travel * tf
(checkbox.cpp:76)
   A cor do knob anima: cr = (int)(92 + (accent_r - 92) * tf) (checkbox.cpp:79)
```

```
24.4.2 - Abas: tab_anim[i] para expansao do nome
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo: gui.cpp:104-112
```

```
   float ease = 1.0f - expf(-dt * 12.0f);
   for (int i = 0; i < n; i++) {
       float target = (active_tab == i) ? 1.0f : 0.0f;
       tab_anim[i] += (target - tab_anim[i]) * ease;
       seg_w[i] = base + tab_anim[i] * extra;  // largura com nome
   }
```

```
   O nome aparece com alpha = tab_anim[i] (gui.cpp:151)
```

```
24.4.3 - Slider: te (track ease) para suavizacao do knob
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo: slider.cpp:48
```

```
   float te = ease(ImGui::GetID("##off"), frac, 20.0f);
   // knob_x = fx0 + KNOB_R + te * usable
```

```
24.4.4 - Botao: ht (hover), pr (press), flash
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo: button.cpp:35-42
```

```
   float ht = ease(st, ImGui::GetID("##h"), hovered ? 1.0f : 0.0f, 16.0f);
   float pr = ease(st, ImGui::GetID("##p"), held ? 1.0f : 0.0f, 20.0f);
   // Flash: cv comeca em 1.0 no click e decai (speed=6)
   if (clicked) cv = 1.0f;
   cv += (0.0f - cv) * (1.0f - expf(-dt * 6.0f));
```

```
24.4.5 - Dropdown: ot (open), bh (box hover)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo: dropdown.cpp:60-61
```

```
   float ot = ease(st, GetID("##ot"), opened ? 1.0f : 0.0f, 14.0f);
   float bh = ease(st, GetID("##bh"), (in_box || opened) ? 1.0f : 0.0f, 16.0f);
   A seta rotaciona 180 graus: ang = PI * ot (dropdown.cpp:80)
```

```
24.4.6 - TextInput: animacao de caracteres (draw_scaled_char)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Arquivo: textinput.cpp:38-56 - Modifica vertices no VtxBuffer:
```

```
   static void draw_scaled_char(ImDrawList* dl, float x, float y, char c,
                                ImU32 col, float anim) {
       float eased = anim * anim * (3.0f - 2.0f * anim);
       int vtx_start = dl->VtxBuffer.Size;
       dl->AddText({ x, y }, col, b);
       int vtx_end = dl->VtxBuffer.Size;
       ImDrawVert* verts = dl->VtxBuffer.Data;
       for (int v = vtx_start; v < vtx_end; v++) {
           verts[v].pos.x = cxc + (verts[v].pos.x - cxc) * eased;
           verts[v].pos.y = cyc + (verts[v].pos.y - cyc) * eased;
           int a = (int)(((verts[v].col >> IM_COL32_A_SHIFT) & 0xFF) * eased);
           verts[v].col = (verts[v].col & ~IM_COL32_A_MASK) | ((ImU32)a <<
IM_COL32_A_SHIFT);
       }
   }
```

```
24.5 - Caret Piscante (Blinking Cursor)
```

```
------------------------------------------
Implementado em textinput.cpp:157 e search.cpp:104:
```

```
   bool blink = fmodf((float)ImGui::GetTime(), 1.0f) < 0.5f;
   if (blink) { /* desenha caret */ }
```

```
   fmodf(time, 1.0f) varia de 0 a 1 a cada segundo. < 0.5 = visivel.
```

# `24.6 - Onda Senoidal no Color Picker` 

```
---------------------------------------
```

```
O color picker (color_edit.cpp:356-377) usa Bezier quadratica + senoide
para conectar a cor primaria a secundaria:
```

```
   float wave = sinf(t * 3.14159f * 2.5f - time * 3.0f) * (len * 0.04f) * sinf(t
```

```
* 3.14159f);
   bx += perp_x * wave;
   by += perp_y * wave;
```

```
24.7 - Resumo das Tecnicas de Animacao
```

```
-----------------------------------------
   ease() exponencial: checkbox, slider, button, dropdown, textinput, keybind
   smoothstep: abertura de popups (dropdown, color_edit, keybind)
   tab_anim[] array: abas do menu principal (gui.cpp)
   VtxBuffer modificado: animacao de caracteres (textinput.cpp)
   fmod + GetTime(): caret piscante (textinput, search)
   senoide + Bezier: onda no color picker (color_edit.cpp)
   Lerp de cores: transicoes de cor em todos os widgets
```

```
===============================================================================
CAPITULO 25: SISTEMA DE CLIPPING
===============================================================================
```

```
25.1 - O que e Clipping
```

```
-------------------------
```

```
Clipping (ou scissor test) e a tecnica de limitar a renderizacao a uma
regiao retangular especifica. Tudo que for desenhado fora desta regiao
e descartado (nao aparece na tela).
```

```
Na Dear ImGui, cada ImDrawCmd possui um campo ClipRect que define a
regiao de clipping para aquele comando de desenho. O backend de
renderizacao traduz isso em chamadas DirectX (RSSetScissorRects).
```

# `Diagrama do Clipping:` 

```
   Tela completa (DisplaySize)
```

```
   +------------------------------------------+
   |                                          |
   |   Regiao de clipping (ClipRect)          |
   |   +----------------------------+         |
   |   |                            |         |
   |   |   Conteudo desenhado       |         |
   |   |   (apenas aqui aparece)    |         |
   |   |                            |         |
   |   +----------------------------+         |
   |                                          |
   |   Fora do ClipRect = cortado             |
   +------------------------------------------+
```

```
25.2 - ClipRect em ImDrawCmd
```

```
-------------------------------
```

```
Cada comando de desenho (ImDrawCmd) carrega seu proprio ClipRect:
```

```
   struct ImDrawCmd {
       ImVec4          ClipRect;    // (x1, y1, x2, y2) em pixels da tela
       ImTextureID     TextureId;
       unsigned int    VtxOffset;
       unsigned int    IdxOffset;
       unsigned int    ElemCount;
   };
```

```
O backend DX11 traduz ClipRect em RSSetScissorRects:
   r.left = (LONG)cmd->ClipRect.x;
   r.top  = (LONG)cmd->ClipRect.y;
   r.right = (LONG)cmd->ClipRect.z;
   r.bottom = (LONG)cmd->ClipRect.w;
   ctx->RSSetScissorRects(1, &r);
```

```
25.3 - PushClipRect / PopClipRect Manual
-------------------------------------------
A ImGui permite clipping manual via PushClipRect/PopClipRect:
```

```
   void PushClipRect(const ImVec2& clip_rect_min,
                     const ImVec2& clip_rect_max,
                     bool intersect_with_current_clip_rect);
```

```
   void PopClipRect();
```

```
O parametro intersect_with_current_clip_rect:
   - true: o novo ClipRect e a INTERSECCAO com o atual
   - false: SUBSTITUI o ClipRect atual
```

```
25.4 - Exemplo no Splinter: Animacao de Abertura de Popup
```

```
-------------------------------------------------------------
O uso mais evidente de clipping manual esta no dropdown.cpp:122:
```

```
   pdl->PushClipRect(
       { bx0 - 2.0f, ptop },
       { bx0 + pw + 2.0f, ptop + reveal + 1.0f }, true);
   // Desenha todos os itens (ate ph), mas clipping so revela 'reveal'
   // ... desenha itens ...
   pdl->PopClipRect();  // dropdown.cpp:158
```

```
O color picker tambem usa (color_edit.cpp:262):
   pdl->PushClipRect({ px - 2.0f, py },
                     { px + pw + 2.0f, py + reveal + 1.0f }, false);
```

```
25.5 - Clipping Automatico na ImGui
```

```
--------------------------------------
1. JANELAS: Cada janela tem ClipRect baseado na area interna.
2. CHILD WINDOWS: Child windows criam novo ClipRect dentro do pai.
3. SCROLL: ClipRect ajustado para mostrar apenas a parte visivel.
```

```
25.6 - Importancia do Clipping para Performance
```

```
--------------------------------------------------
   - GPU descarta fragmentos fora do ClipRect ANTES de processa-los
   - Sem clipping, vertices invisiveis seriam processados
   - ImGui otimiza quebrando draw calls com diferentes ClipRects
```

```
===============================================================================
CAPITULO 26: SISTEMA DE LAYOUT
===============================================================================
26.1 - Introducao
-------------------
O sistema de layout da ImGui e automatico: widgets sao posicionados
sequencialmente. No entanto, o Splinter combina layout automatico com
posicoes manuais calculadas para criar interfaces mais complexas.
```

```
26.2 - Layout Automatico (Funcoes de Controle de Cursor)
-----------------------------------------------------------
GETCURSORSCREENPOS:    pos = ImGui::GetCursorScreenPos();  // checkbox.cpp:20
GETCONTENTREGIONAVAIL: avail = GetContentRegionAvail().x;  // checkbox.cpp:21
SAMELINE:              ImGui::SameLine();
DUMMY:                 ImGui::Dummy({0, 6.0f});
SPACING:               ImGui::Spacing();
INDENT:                ImGui::Indent(20.0f); ImGui::Unindent(20.0f);
GROUP:                 ImGui::BeginGroup(); ... EndGroup();
```

```
26.3 - Layout Manual no Splinter
```

```
-----------------------------------
```

```
O Splinter usa posicoes fixas calculadas para o painel principal.
Em gui.cpp:52-59:
```

```
   float margin_left = 40.0f;
   float margin_right = 240.0f;
   float margin_top = 60.0f;
   float margin_bottom = 50.0f;
   panel_w = width - margin_left - margin_right;
   panel_h = height - margin_top - margin_bottom;
```

```
Estas variaveis sao usadas por todos os subsystems:
   - Abas: tabs.get(active).render(panel_x+20, panel_y+header_h+16, ...)
   - Search: search::render(panel_x+panel_w-pad, panel_y, header_bar_h)
   - Watermark: watermark::render(panel_x, panel_y, panel_w, panel_h)
   - Keybinds: keybinds::render(panel_x, panel_y, panel_w, panel_h)
   - Notifications: notify::render(panel_x, panel_y, panel_w, panel_h)
```

```
26.4 - Combinacao dos Dois Mundos
```

```
------------------------------------
CAMADA 1: Manual (painel principal)
   gui.cpp:39-48 - Janela com posicao/tamanho FIXOS
   gui.cpp:52-94 - Fundo, header, abas e search posicionados manualmente
```

```
CAMADA 2: Automatico (dentro das secoes)
   combat.cpp:64-93 - SetCursorScreenPos + BeginChild + widgets
```

```
Diagrama:
```

```
   +----------------------------------------------------------+
   |  JANELA PRINCIPAL (manual)                                |
   |  +------- PAINEL (manual: AddRectFilled) ---------------+ |
   |  |  HEADER (manual) + SEARCH (pos fixa)                | |
   |  |  +--- ABA (InvisibleButton + AddText manual) ------+ | |
   |  |  +-------------------------------------------------+ | |
   |  |  +--- SECAO (SetCursorScreenPos + BeginChild) ----+ | |
   |  |  |  CHECKBOX (auto: GetCursorScreenPos)           | | |
   |  |  |  SLIDER (auto: GetCursorScreenPos)             | | |
   |  |  +-------------------------------------------------+ | |
   |  +-----------------------------------------------------+ |
   +----------------------------------------------------------+
```

# `26.5 - Pilha de Layout (Push/Pop)` 

```
------------------------------------
PILHA DE ID (PushID/PopID):          checkbox.cpp:18/100
PILHA DE ESTILO (PushStyleColor):    combat.cpp:83/92
PILHA DE VAR (PushStyleVar):         dropdown.cpp:108-111/162
PILHA DE FONT (PushFont/PopFont):    keybind.cpp:340/344
PILHA DE CLIPRECT (PushClipRect):    dropdown.cpp:122/158
```

```
IMPORTANTE: Todas as pilhas devem ser balanceadas!
```

```
26.6 - ItemWidth (SetNextItemWidth)
```

```
--------------------------------------
A largura dos widgets pode ser controlada mas os widgets custom do
Splinter ignoram e usam GetContentRegionAvail().x.
```

```
===============================================================================
CAPITULO 27: INTERFACES RESPONSIVAS
===============================================================================
```

# `27.1 - Introducao` 

```
-------------------
Uma interface responsiva se adapta a diferentes tamanhos de tela.
O Splinter, sendo uma janela redimensionavel, calcula posicoes e
```

```
tamanhos relativos ao inves de usar valores fixos.
```

# `27.2 - Calculos Baseados em Tamanho de Tela` 

```
----------------------------------------------
Variaveis globais em window.h:12-15, atualizadas em gui.cpp:52-64:
```

```
   float panel_w = width - margin_left - margin_right;
   float panel_h = height - margin_top - margin_bottom;
```

```
Dentro das abas, tamanhos sao ainda mais relativos:
   float col_w = (w - gap) * 0.5f;   // combat.cpp:97 - metade da largura
   float half_h = (h - gap) * 0.5f;  // combat.cpp:98 - metade da altura
```

```
27.3 - WM_SIZE e Resize
```

```
--------------------------
```

```
Quando o usuario redimensiona, WM_SIZE (window.cpp:60-66) atualiza
width/height e chama dx11::resize (dx11.cpp:76-82), que recria o RTV.
```

```
   case WM_SIZE:
```

```
       width = LOWORD(lp); height = HIWORD(lp);
       splinter::dx11::resize(width, height);
```

```
27.4 - Estrategias para Interfaces Responsivas
```

```
--------------------------------------------------
```

`1. TAMANHOS RELATIVOS: col_w = (w - gap) * 0.5f` 

`2. MARGENS CENTRALIZADAS: (SM_CXSCREEN - w) / 2 (window.cpp:86)` 

`3. GETCONTENTREGIONAVAIL: avail = GetContentRegionAvail().x (checkbox.cpp:21)` 

`4. CALCTEXTSIZE: ts = CalcTextSize(label); tx = pos.x + (avail - ts.x)*0.5f` 

`5. CLAMPING: if (box_w > avail*0.6f) box_w = avail*0.6f (keybind.cpp:303)` 

# `27.5 - Exemplo: Calculo de Colunas de Abas Responsivo` 

```
---------------------------------------------------------
```

```
Em combat.cpp:95-101: col_w = (w-gap)*0.5f, half_h = (h-gap)*0.5f
Em visuals.cpp:81-84: mesmo padrao.
```

```
===============================================================================
CAPITULO 28: OTIMIZACAO DE DESEMPENHO
```

```
===============================================================================
```

# `28.1 - Introducao` 

```
-------------------
```

```
Embora a Dear ImGui seja eficiente, projetos com muitos widgets podem
enfrentar problemas de performance se nao forem cuidados. O Splinter
implementa varias tecnicas de otimizacao.
```

# `28.2 - Gargalos Comuns de Performance` 

```
----------------------------------------
```

`1. MUITOS WIDGETS INVISIVEIS: Processar widgets fora da tela.` 

`2. DRAW CALLS EXCESSIVOS: Muitos comandos individuais.` 

`3. FONT ATLAS GRANDE: Muitas fontes aumentam memoria.` 

`4. PUSHSTYLECOLOR EM LOOPS: Quebra de draw calls.` 

`5. CALCTEXTSIZE REPETIDO: Calcular o mesmo texto varias vezes.` 

# `28.3 - Tecnicas de Otimizacao no Splinter` 

```
---------------------------------------------
```

# `28.3.1 - Early Exit com Search (PRINCIPAL)` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Todos os widgets verificam se o label corresponde a busca ANTES de
qualquer processamento. Quando o usuario filtra, apenas widgets
correspondentes sao processados.
```

```
   if (!splinter::search::matches(label)) return false;
```

```
   // Presente em: checkbox.cpp:17, slider.cpp:22, dropdown.cpp:29,
   //              button.cpp:22, textinput.cpp:59, keybind.cpp:290,
   //              color_edit.cpp:534
```

```
A funcao matches() (search.cpp:14-26):
   bool matches(const char* text) {
       if (query[0] == 0) return true;  // sem filtro
       return strstr(b, a) != nullptr;   // lowercase + strstr
   }
```

```
28.3.2 - Clipping Automatico
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A ImGui ja faz clipping automatico. Widgets fora da area visivel nao
geram vertices, essencial em janelas com scroll.
```

```
28.3.3 - Agrupar Desenhos
^^^^^^^^^^^^^^^^^^^^^^^^^^^
Em vez de varios AddRectFilled individuais, desenha-se o maximo em um
unico comando. Ex: section() em combat.cpp desenha fundo, borda e
linha separadora sequencialmente (agrupados pela ImGui).
```

```
28.3.4 - Cache CalcTextSize
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Calcular o tamanho do texto repetidamente e caro. O Splinter calcula
uma vez e reusa:
```

```
   float th = ImGui::CalcTextSize(title).y;  // combat.cpp:78
   dl->AddText({x+12, y+(bar_h-th)*0.5f}, ..., title);  // reusa th
```

```
28.3.5 - Anti-Aliasing
^^^^^^^^^^^^^^^^^^^^^^^^
A ImGui tem AA embutido (ativado por padrao). Pode ser desabilitado:
   style.AntiAliasedLines = false;
   style.AntiAliasedFill = false;
O Splinter mantem o AA ativado.
```

```
28.3.6 - Evitar PushStyleColor em Loops
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
No dropdown, PushStyleColor e PushStyleVar sao feitos UMA vez antes
do loop (dropdown.cpp:108-111), nao dentro do loop:
```

```
   ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, {0,0});
   ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 6.0f);
   ImGui::PushStyleVar(ImGuiStyleVar_WindowBorderSize, 0.0f);
   ImGui::PushStyleColor(ImGuiCol_WindowBg, ImVec4(0,0,0,0));
   ImGui::Begin("##ddpop", ...);
   for (int i = 0; i < count; i++) {
       // SEM PushStyleColor aqui!
   }
   ImGui::End();
   ImGui::PopStyleColor(1);
   ImGui::PopStyleVar(3);
```

```
28.4 - Uso da Metrics/Demo Window para Debug
-----------------------------------------------
   ImGui::ShowMetricsWindow();  // Estatisticas em tempo real
   ImGui::ShowDemoWindow();     // Todos os widgets + debug
```

```
Interpretacao:
   - < 1000 vertices/frame: otimo
   - 1000-5000: bom
   - 5000-20000: aceitavel
   - > 20000: otimizar
   - < 10 draw calls: excelente
```

```
   - 10-50: bom
```

```
   - 50-200: aceitavel
```

```
   - > 200: investigar
```

```
===============================================================================
CAPITULO 29: ERROS COMUNS E BOAS PRATICAS
===============================================================================
```

# `29.1 - Introducao` 

```
-------------------
Trabalhar com Dear ImGui e relativamente simples, mas existem armadilhas
comuns. Este capitulo lista os erros mais frequentes e as boas praticas.
```

```
29.2 - Erros Comuns
```

```
-----------------------
```

```
ERRO 1: Esquecer End() / EndChild() / EndTable()
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Cada Begin precisa de um End. Esquecer causa comportamento indefinido.
```

```
   // ERRADO:
   ImGui::Begin("Janela");
   ImGui::Text("Oi");  // falta End()!
   // CERTO:
   ImGui::Begin("Janela");
   ImGui::Text("Oi");
   ImGui::End();
```

```
No Splinter: gui.cpp:41-48 (Begin), gui.cpp:174 (End).
```

```
ERRO 2: IDs Duplicados
^^^^^^^^^^^^^^^^^^^^^^^^
Se dois widgets usarem o mesmo ID, a ImGui nao consegue distingui-los.
   // ERRADO: for (int i=0; i<3; i++) ImGui::Button("Botao");
   // CERTO:  for (int i=0; i<3; i++) { PushID(i); Button("Botao"); PopID(); }
```

```
Splinter: gui.cpp:131 - PushID(i) no loop de abas.
```

```
ERRO 3: Nao Verificar o Retorno de Begin()
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Se uma janela esta colapsada ou fora da tela, Begin() retorna false.
```

```
   if (ImGui::Begin("Janela")) {
       ImGui::Button("OK");  // apenas se visivel
   }
   ImGui::End();
```

```
ERRO 4: Push/Pop Desbalanceados
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Cada Push precisa de um Pop correspondente.
```

```
   PushStyleColor + PushStyleColor = PopStyleColor(2)
```

```
Splinter: dropdown.cpp:108-162: PushStyleVar(3), PopStyleVar(3).
```

```
ERRO 5: Usar ImGui Depois de DestroyContext()
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Chamar funcoes ImGui depois de DestroyContext() causa crash.
```

```
   ImGui_ImplDX11_Shutdown(); ImGui_ImplWin32_Shutdown();
   ImGui::DestroyContext();  // ULTIMA chamada!
```

```
29.3 - Boas Praticas
```

```
-----------------------
PRATICA 1: Organizar por Camadas - main.cpp -> create -> init -> loop ->
shutdown
PRATICA 2: Usar Namespaces - splinter::window::, splinter::gui::, etc.
PRATICA 3: Centralizar o Tema - theme.h com accent_r/g/b
PRATICA 4: Forward Declarations - ponteiros de funcao (tabs.h:12)
PRATICA 5: Funcoes static em .cpp - evitar conflitos de linkagem
PRATICA 6: constexpr para Constantes - static constexpr float pad_x = 12.0f;
```

```
===============================================================================
CAPITULO 30: ARQUITETURA DE PROJETOS COM IMGUI
===============================================================================
```

# `30.1 - Introducao` 

```
-------------------
```

```
Projetos complexos com Dear ImGui precisam de uma arquitetura bem
definida. Este capitulo apresenta a arquitetura do Splinter como modelo.
```

# `30.2 - Separacao em 3 Camadas` 

```
--------------------------------
```

```
O Splinter segue o padrao classico de 3 camadas:
```

```
   +============================================================+
   |  CAMADA 1: INICIALIZACAO (setup)                           |
   |  main.cpp:5-8: Criar janela, D3D11, ImGui, fontes, tema   |
   +===========================+================================+
   |  CAMADA 2: LOOP (frames)  | main.cpp:10-23                |
   |  while (!WM_QUIT) {                                        |
   |    PeekMessage -> Dispatch -> update_drag()               |
   |    begin_frame() -> gui::render() -> end_frame()          |
   |  }                                                         |
   +===========================+================================+
   |  CAMADA 3: SHUTDOWN       | main.cpp:25-28                |
   |  Shutdown backends, DestroyContext, Release D3D11,        |
   |  DestroyWindow + UnregisterClass                          |
   +============================================================+
```

# `30.3 - Estrutura de Diretorios Recomendada` 

```
---------------------------------------------
   splinter/
     ext/
       imgui/            (NUCLEO IMUTAVEL)
       menu/             (CODIGO MODIFICAVEL)
         app/main.cpp
         window/         (window.h/.cpp, dx11.h/.cpp)
         gui/            (gui.h/.cpp)
         theme/          (theme.h/.cpp)
         tabs/           (tabs.h/.cpp + 4 abas)
         search/         (search.h/.cpp)
         assets/         (fonts.h/.cpp, fredoka_font.h, icons_font.h)
         elements/
           widgets/      (widgets.h + 7 widgets)
           watermark/
           keybind list/
           notifications/
```

# `30.4 - Fluxo de Execucao Completo` 

```
------------------------------------
```

```
   WinMain
```

- `-> window::create (RegisterClassExW, CreateWindowExW, ShowWindow)` 

- `-> dx11::create (D3D11CreateDevice, SwapChain, RTV, DComp)` 

- `-> gui::init (CreateContext, backends, fonts, theme)` 

```
     -> LOOP:
        PeekMessage -> Dispatch (WndProc)
        update_drag (window.cpp:100)
        begin_frame (dx11.cpp:84: NewFrame x3)
        gui::render (gui.cpp:34: 182 linhas)
        end_frame (dx11.cpp:90: Render, ClearRTV, RenderDrawData, Present)
     -> gui::shutdown (backends + DestroyContext)
     -> dx11::destroy (Release all)
```

- `-> window::destroy (DestroyWindow + UnregisterClass)` 

# `30.5 - Comunicacao entre Arquivos` 

```
-------------------------------------
   main.cpp --> window/, dx11/, gui/
   gui/gui.cpp --> window/, dx11/, theme/, tabs/, assets/, search/,
                   widgets/, watermark/, keybinds/, notifications/
   tabs/combat.cpp --> tabs/, widgets/
   widgets/checkbox.cpp --> theme/, search/
```

```
30.6 - Como Adicionar Novas Abas, Widgets e Janelas
```

```
------------------------------------------------------
ABAS:   tabs/minha_aba.cpp + declarar em tabs.h + adicionar em tabs.cpp
WIDGETS: elements/widgets/novo/ + incluir em widgets.h + adicionar ao vcxproj
JANELAS: novo modulo com Begin/End + chamar de gui::render()
```

```
===============================================================================
CAPITULO 31: DEPURACAO DE PROBLEMAS
===============================================================================
```

# `31.1 - Introducao` 

```
-------------------
Depurar problemas em uma interface ImGui pode ser desafiador porque
muitos erros sao silenciosos. Felizmente, a ImGui oferece ferramentas
de debug poderosas.
```

# `31.2 - Janelas de Debug da ImGui` 

```
------------------------------------
```

# `31.2.1 - ShowDemoWindow` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^
Mostra todos os widgets em acao. Essencial para aprender:
   ImGui::ShowDemoWindow();
```

```
31.2.2 - ShowMetricsWindow
```

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Ferramenta de debug mais util. Mostra:
```

- `Versao da ImGui e config IO` 

- `Windows abertas com detalhes` 

- `Draw calls (CmdLists, comandos, vertices, indices)` 

- `Memoria usada` 

```
   - Tools: Item Picker (clique em widget para ver ID/estado)
```

# `31.2.3 - ShowDebugLogWindow` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Mostra o log interno de depuracao:
   ImGui::ShowDebugLogWindow();
```

# `31.2.4 - ShowStackToolWindow` 

```
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

```
Inspeciona a pilha de IDs:
   ImGui::ShowStackToolWindow();
   Mostra: janela atual, item atual, pilha de IDs com labels.
```

```
31.3 - Problemas Comuns e Solucoes
```

```
--------------------------------------
```

```
PROBLEMA 1: Nada aparece na tela
```

```
   Causas: NewFrame() nao chamado, Render() nao chamado, backend nao init.
   Solucao: Verifique: NewFrame -> widgets -> Render -> RenderDrawData.
```

```
PROBLEMA 2: Widgets nao respondem
   Causas: InvisibleButton com tamanho zero, ID duplicado, sobreposicao.
   Solucao: Use Metrics -> Item Picker para ver o que recebe o clique.
```

```
PROBLEMA 3: Cores erradas
   Causas: PushStyleColor sem Pop, IM_COL32 valores fora de 0-255.
   Solucao: Verifique balanceamento Push/Pop.
```

```
PROBLEMA 4: Fontes pixeladas
   Causas: Tamanho muito pequeno, FontGlobalScale incorreto.
   Solucao: Verifique io.DisplaySize, aumente fonte, use FreeType.
```

```
PROBLEMA 5: Baixa performance
   Causas: Muitos widgets invisiveis, draw calls excessivos.
   Solucao: Capitulo 28. Use Metrics Window.
```

# `31.4 - Assertions Internas da ImGui` 

```
--------------------------------------
Assertions comuns em DEBUG:
```

```
   IM_ASSERT(g.CurrentWindowStack.Size == 0)       // Push/Pop desbalanceados
   IM_ASSERT(g.CurrentWindow && BeginCount == 1)   // Begin sem End
```

```
Para habilitar: configure projeto para Debug.
```

```
31.5 - Logging
```

```
-----------------
   ImGui::LogToTTY();       // Log no terminal
   ImGui::LogToFile();      // Log em arquivo
   ImGui::LogToClipboard(); // Area de transferencia
   ImGui::LogFinish();      // Finaliza
```

```
Uso no Splinter (exemplo):
   ImGui::LogToTTY();
   ImGui::LogText("Frame: active_tab=%d\n", active_tab);
   ImGui::LogFinish();
```

# `31.6 - Dicas de Depuracao` 

```
-----------------------------
```

`1. ISOLAMENTO: Comente codigo ate encontrar o problema` 

`2. ITEM PICKER: Metrics -> Tools -> Item Picker` 

`3. CORES DE TESTE: IM_COL32(255,0,0,255)` 

`4. CHECK VERSION: IMGUI_CHECKVERSION()` 

`5. ASSERT: Adicione IM_ASSERT para pre-condicoes` 

`6. LOG: LogToTTY para rastrear fluxo` 

```
===============================================================================
CAPITULO 32: RENDERIZACAO ATE A GPU
```

```
===============================================================================
```

# `32.1 - Introducao` 

```
-------------------
```

```
Este capitulo traca o caminho dos dados desde a aplicacao ate a GPU.
```

# `32.2 - Pipeline Completo` 

```
----------------------------
```

```
Diagrama do pipeline de renderizacao:
```

```
   +------------------------------------------------------------------+
```

```
   |  APLICACAO (C++)                                                  |
   |  gui::render() { ImGui::Button() -> AddRectFilled + AddText     |
   |    -> Adiciona vertices/indices aos buffers -> Adiciona ImDrawCmd }|
   +---------------------------+--------------------------------------+
                               |  ImGui::Render()
   +---------------------------v--------------------------------------+
   |  IMGUI CORE: Produz ImDrawData                                   |
   |    CmdLists[], TotalVtxCount, DisplayPos, DisplaySize            |
   +---------------------------+--------------------------------------+
                               |  ImGui_ImplDX11_RenderDrawData
   +---------------------------v--------------------------------------+
   |  BACKEND DX11: Cria buffers, chama DrawIndexed                  |
   |    Map vertex/index buffer (MAP_WRITE_DISCARD)                  |
   |    Para cada DrawCmd: SetVertexBuffers, SetScissorRects,        |
   |      SetShaderResources, SetBlendState, DrawIndexed             |
   +---------------------------+--------------------------------------+
                               |
   +---------------------------v--------------------------------------+
   |  GPU:                                                           |
   |    INPUT ASSEMBLER: Le vertices (pos, uv, col) + indices        |
   |    VERTEX SHADER: Screen-space -> Clip-space (NDC -1 a 1)      |
   |    RASTERIZER: Scissor test + geracao de fragmentos            |
   |    PIXEL SHADER: textura * vertex_color                        |
   |    OUTPUT MERGER: Alpha blend + escreve no RenderTarget         |
   +---------------------------+--------------------------------------+
                               |  swap_chain->Present
   +---------------------------v--------------------------------------+
   |  APRESENTACAO: Exibe frame no monitor                          |
   +------------------------------------------------------------------+
```

```
32.3 - Vertex Shader da ImGui
```

```
-------------------------------
Transforma screen-space para clip-space (NDC):
```

```
   output.pos.x = (input.pos.x / DisplaySize.x) * 2.0f - 1.0f;
   output.pos.y = -(input.pos.y / DisplaySize.y) * 2.0f + 1.0f;  // y invertido
   output.pos.z = 0.0f;   // depth = 0 (sempre na frente)
   output.pos.w = 1.0f;   // sem perspectiva
```

```
O vertex shader e compilado como bytecode pre-compilado no backend
(constante __VS_SRC). Nao requer arquivo .hlsl separado.
```

```
32.4 - Pixel Shader da ImGui
```

```
-------------------------------
Simples: amostra textura na UV e multiplica pela cor do vertice:
```

```
   float4 tex = texture.Sample(sampler, input.uv);
   return tex * input.col;
```

```
A textura pode ser:
```

```
   - Atlas de fontes (para texto)
   - TexUvWhitePixel (para formas coloridas)
```

```
32.5 - TexUvWhitePixel: Como Funciona
```

```
----------------------------------------
Quando desenhamos formas coloridas (AddRectFilled, AddCircle), a ImGui
usa uma texura especial de 1 pixel BRANCO.
```

```
   _Data->TexUvWhitePixel = UV do pixel branco no atlas
```

```
O pixel shader faz: tex = (1,1,1,1) (branco) -> tex * col = col pura
Isso faz com que a cor do vertice seja a cor final (multiplicada por 1).
```

```
Para texto: a textura contem o alpha do glyph.
```

```
   tex = alpha do glyph -> tex * col = alpha * cor desejada
```

```
32.6 - Gerenciamento de Memoria dos Buffers (DX11)
```

```
------------------------------------------------------
```

`1. VERTEX BUFFER: Armazena vertices (pos, uv, cor)` 

`2. INDEX BUFFER: Armazena indices (triangulos)` 

`3. CONSTANT BUFFER: Matriz de projecao (DisplaySize)` 

```
Criacao (D3D11_USAGE_DYNAMIC + D3D11_CPU_ACCESS_WRITE):
   D3D11_BUFFER_DESC vb_desc = {};
   vb_desc.Usage = D3D11_USAGE_DYNAMIC;
   vb_desc.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;
   vb_desc.BindFlags = D3D11_BIND_VERTEX_BUFFER;
```

```
Mapeamento a cada frame (MAP_WRITE_DISCARD):
   context->Map(vertex_buffer, 0, D3D11_MAP_WRITE_DISCARD, 0, &mapped);
   memcpy(mapped.pData, draw_list->VtxBuffer.Data, size);
   context->Unmap(vertex_buffer, 0);
```

```
MAP_WRITE_DISCARD: descarta TODO o conteudo anterior. Permite que o
driver aloque memoria nova sem esperar a GPU terminar de usar o antigo.
```

# `32.7 - DrawIndexed` 

```
--------------------
```

```
Cada ImDrawCmd e renderizado com DrawIndexed:
```

```
   context->DrawIndexed(ElemCount, IdxOffset, VtxOffset);
```

- `ElemCount: numero de indices (3 por triangulo)` 

- `IdxOffset: offset no index buffer` 

- `VtxOffset: offset no vertex buffer` 

```
Diagrama de um DrawCmd com um retangulo (2 triangulos):
   DrawCmd { ClipRect, TextureId, VtxOffset=0, IdxOffset=0, ElemCount=6 }
   VtxBuffer: [A] [B] [C] [D] (4 vertices)
   IdxBuffer: [0 1 2 0 2 3]   (2 triangulos: A-B-C, A-C-D)
```

```
===============================================================================
CAPITULO 33: ANALISE COMPLETA DO PROJETO SPLINTER
===============================================================================
```

# `33.1 - Introducao` 

```
-------------------
Este capitulo apresenta uma analise completa do projeto Splinter, mostrando
como todos os arquivos se encaixam para formar o sistema final.
```

```
33.2 - Estrutura Completa do Projeto
```

```
----------------------------------------
   splinter/
     splinter.vcxproj, .filters, .user, imgui.ini
     ext/
       imgui/           (NUCLEO: imconfig.h, imgui.h/.cpp, imgui_internal.h,
                         imgui_widgets.cpp, imgui_draw.cpp, imgui_tables.cpp,
                         imgui_demo.cpp, imstb_truetype.h, imstb_textedit.h,
                         imstb_rectpack.h)
         backends/      (imgui_impl_win32.h/.cpp, imgui_impl_dx11.h/.cpp)
         misc/freetype/ (imgui_freetype.h/.cpp)
       menu/            (CODIGO SPLINTER)
         app/main.cpp
         window/        (window.h/.cpp, dx11.h/.cpp)
         gui/           (gui.h/.cpp - 182 linhas)
         theme/         (theme.h/.cpp - 46 linhas de estilo)
         assets/        (fonts.h/.cpp, fredoka_font.h, icons_font.h)
         search/        (search.h/.cpp - 110 linhas)
```

```
         tabs/          (tabs.h/.cpp + combat.cpp, visuals.cpp, misc.cpp,
settings.cpp)
         elements/
           widgets/     (widgets.h + 7 pastas de widgets)
           watermark/   (watermark.h/.cpp)
           keybind list/(keybinds.h/.cpp - 206 linhas)
           notifications/(notifications.h/.cpp - 94 linhas)
       thirdparty/freetype/ (headers FreeType opcionais)
```

```
33.3 - Comunicacao entre Arquivos
-------------------------------------
   main.cpp --> window/window.h, window/dx11.h, gui/gui.h
   gui/gui.cpp --> window/window.h, window/dx11.h, theme/theme.h,
                   tabs/tabs.h, assets/fonts.h, search/search.h,
                   widgets/widgets.h, watermark/watermark.h,
                   keybinds/keybinds.h, notifications/notifications.h
   tabs/combat.cpp --> tabs/tabs.h, widgets/widgets.h
   theme/theme.cpp --> theme/theme.h
   search/search.cpp --> search/search.h, theme/theme.h, assets/fonts.h
   widgets/checkbox/checkbox.cpp --> checkbox.h, theme/theme.h, search/search.h
   widgets/slider/slider.cpp     --> slider.h, theme/theme.h, search/search.h
   widgets/dropdown/dropdown.cpp --> dropdown.h, theme/theme.h, search/search.h
   widgets/button/button.cpp     --> button.h, theme/theme.h, search/search.h
   widgets/textinput/textinput.cpp --> textinput.h, theme/theme.h,
search/search.h
   widgets/keybind/keybind.cpp   --> keybind.h, theme/theme.h, search/search.h
   widgets/color_edit/color_edit.cpp --> color_edit.h, theme/theme.h,
search/search.h
```

```
33.4 - Fluxo de Execucao Completo (Linha a Linha)
```

```
-----------------------------------------------------
   main.cpp:5   WinMain
   main.cpp:6   window::create (window.cpp:71-93) RegisterClassExW,
                CreateWindowExW (WS_POPUP, 960x700), ShowWindow
   main.cpp:7   dx11::create (dx11.cpp:12-52) D3D11CreateDevice, SwapChain
                (CreateSwapChainForComposition), DComp, create_rtv
   main.cpp:8   gui::init (gui.cpp:23-31)
                -> ImGui::CreateContext()
                -> ImGui_ImplWin32_Init(hwnd)
                -> ImGui_ImplDX11_Init(device, context)
                -> assets::load_fonts() (Fredoka 18px + icons 20px)
                -> theme::apply() (configura estilo)
   main.cpp:10-23 LOOP:
                PeekMessage -> Dispatch (WndProc: WM_SIZE, WM_DESTROY)
                update_drag() (window.cpp:100-128)
                begin_frame() (dx11.cpp:84-88: NewFrame x3)
                gui::render() (gui.cpp:34-174: 182 linhas)
                end_frame() (dx11.cpp:90-97: Render, ClearRTV, RenderDrawData,
Present)
   main.cpp:25-27 SHUTDOWN:
                gui::shutdown() -> Shutdown backends + DestroyContext
                dx11::destroy() -> Release device, context, swap, comp
                window::destroy() -> DestroyWindow + UnregisterClass
```

```
33.5 - Como Renderizacao Acontece (dx11::begin_frame/end_frame)
-------------------------------------------------------------------
   begin_frame() (dx11.cpp:84-88):
```

`1. ImGui_ImplDX11_NewFrame()  - Reseta buffers` 

```
     2. ImGui_ImplWin32_NewFrame() - Processa input
```

`3. ImGui::NewFrame()          - Inicia frame` 

```
   end_frame() (dx11.cpp:90-97):
```

`1. ImGui::Render()            - Finaliza frame, produz ImDrawData` 

`2. ClearRenderTargetView      - Limpa backbuffer` 

`3. ImGui_ImplDX11_RenderDrawData - Renderiza comandos` 

`4. swap_chain->Present(1, 0)  - Apresenta na tela` 

```
33.6 - Como o Tema e Aplicado (theme::apply)
-----------------------------------------------
Arquivo: theme.cpp:4-45
```

```
   Configuracoes de estilo (theme.cpp:8-18):
     WindowPadding={0,0}, FramePadding={8,6}, ItemSpacing={8,6}
     WindowRounding=10, FrameRounding=6, GrabRounding=4
     WindowBorderSize=0, FrameBorderSize=0, ChildBorderSize=1
```

```
   Cores (theme.cpp:20-44):
     WindowBg:     (22,21,27)
     ChildBg:      (22,21,27)
     Border:       (30,30,30)
     FrameBg:      (30,30,38)
     Button:       (30,30,38)
     Text:         (217,217,224)
     CheckMark:    accent (130,90,230) ROXO
     SliderGrab:   accent
     Tab:          (26,26,33)
     TabHovered:   accent com 30% alpha
     TabSelected:  accent com 20% alpha
```

```
33.7 - Como Fontes sao Carregadas (assets::load_fonts)
```

```
---------------------------------------------------------
```

```
Arquivo: fonts.cpp:7-22
```

`1. Fonte Fredoka 18px (AddFontFromMemoryTTF, dados em fredoka_font.h)` 

`2. Fonte de icones 20px (AddFontFromMemoryTTF, dados em icons_font.h)` 

```
33.8 - Como Widgets sao Desenhados (gui::render)
```

```
---------------------------------------------------
```

```
   Estrutura (gui.cpp:34-174):
```

`1. UPDATE (linhas 35-37): binds, color pickers, keybind pickers` 

`2. JANELA (linhas 39-48): SetNextWindowPos/Size + Begin("##splinter")` 

`3. FUNDO (linhas 50-94): AddRectFilled painel + header + borda` 

`4. ABAS (linhas 96-157): animacao, InvisibleButton, AddText` 

`5. SEARCH (linha 159): search::render` 

`6. ABA ATIVA (linhas 161-166): tabs.get(active).render` 

`7. FLUTUANTES (linhas 168-172): watermark + keybinds + notifications` 

`8. FIM (linha 174): ImGui::End()` 

```
33.9 - Como Adicionar Novas Abas
```

```
-----------------------------------
```

```
   PASSO 1: Crie ext\menu\tabs\inventory.cpp
```

```
   PASSO 2: Implemente void render_inventory(float, float, float, float)
   PASSO 3: Declare em tabs.h
   PASSO 4: Adicione ao array em tabs.cpp: { "Name", ICON, render_fn }
```

```
33.10 - Como Adicionar Novos Widgets
```

```
---------------------------------------
```

```
   PASSO 1: Crie ext\menu\elements\widgets\novo_widget\novo_widget.h/.cpp
   PASSO 2: Implemente funcao booleana
   PASSO 3: Inclua em widgets.h
   PASSO 4: Adicione ao vcxproj
```

# `33.11 - Como Adicionar Novas Janelas` 

```
---------------------------------------
   Use ImGui::Begin/End em modulo separado e chame de gui::render().
```

```
===============================================================================
```

```
CAPITULO 34: PROJETO MINIMO COM APENAS A IMGUI (CAPITULO MAIS IMPORTANTE)
===============================================================================
```

```
34.1 - Introducao
```

```
-------------------
Este e o capitulo mais importante do curso. Vamos criar um projeto
completo, funcional e MINIMO que mostra apenas a Dear ImGui. Sem
jogos, sem ESP, sem hooks, sem overlay, sem acrylic, sem DComp.
Apenas uma janela Windows com uma interface ImGui pura.
```

```
34.2 - Diferenca entre Splinter e o Projeto Minimo
```

```
-----------------------------------------------------
   Splinter:                              Projeto Minimo:
   Janela WS_POPUP sem bordas             WS_OVERLAPPEDWINDOW normal
   Efeito acrylic                         Sem acrylic
   DirectComposition                      Swap chain normal
   Multiplas fontes                       AddFontDefault
   Tema customizado                       Tema padrao
   7 widgets customizados                 Widgets nativos
   Sistema de abas                        Uma janela simples
```

```
34.3 - Arquivos Indispensaveis
---------------------------------
OBRIGATORIOS (nucleo):
   imgui.h, imgui.cpp, imgui_widgets.cpp, imgui_draw.cpp,
   imgui_tables.cpp, imgui_internal.h, imconfig.h,
   imstb_truetype.h, imstb_textedit.h, imstb_rectpack.h
```

```
OBRIGATORIOS (backends):
   imgui_impl_win32.h/.cpp, imgui_impl_dx11.h/.cpp
```

```
ADICIONAL:
```

```
   main.cpp (nosso codigo)
```

```
34.4 - Arquivos que Podem ser Removidos
------------------------------------------
Para o projeto minimo, voce NAO precisa de:
   imgui_demo.cpp           (opcional, removivel)
   misc/freetype/           (nao usa FreeType)
   ext/menu/ (todo)         (todo codigo Splinter)
   ext/thirdparty/freetype/ (headers FreeType)
```

```
34.5 - Dependencias Obrigatorias
```

```
------------------------------------
Linker -> Additional Dependencies:
   d3d11.lib     - DirectX 11
   dxgi.lib      - DXGI (criar swap chain)
NAO precisa de: dcomp.lib, dwmapi.lib
```

```
34.6 - CODIGO COMPLETO DO main.cpp MINIMO (150+ linhas)
----------------------------------------------------------
   //===================================================================
   // main.cpp - Projeto Minimo Dear ImGui + DirectX 11 + Win32
   // Apenas d3d11.lib + dxgi.lib + Windows SDK
   //===================================================================
```

```
   #include <windows.h>
   #include <d3d11.h>
   #include <dxgi1_2.h>
   #include "imgui.h"
   #include "backends/imgui_impl_win32.h"
   #include "backends/imgui_impl_dx11.h"
```

```
   HWND                    g_hwnd = nullptr;
```

```
   ID3D11Device*           g_device = nullptr;
   ID3D11DeviceContext*    g_context = nullptr;
   IDXGISwapChain*         g_swap_chain = nullptr;
   ID3D11RenderTargetView* g_rtv = nullptr;
   LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp);
```

```
   //=== CRIAR RENDER TARGET VIEW ===
   bool CreateRenderTarget() {
       ID3D11Texture2D* bb = nullptr;
       if (g_swap_chain->GetBuffer(0, IID_PPV_ARGS(&bb)) != S_OK) return false;
       g_device->CreateRenderTargetView(bb, nullptr, &g_rtv);
       bb->Release();
       return (g_rtv != nullptr);
   }
   //=== INICIALIZAR DIRECTX 11 ===
   bool InitD3D11(HWND hwnd, int w, int h) {
       D3D_FEATURE_LEVEL level;
       if (D3D11CreateDevice(nullptr, D3D_DRIVER_TYPE_HARDWARE, nullptr,
               D3D11_CREATE_DEVICE_BGRA_SUPPORT, nullptr, 0,
               D3D11_SDK_VERSION, &g_device, &level, &g_context) != S_OK)
           return false;
       IDXGIDevice* dxgi_dev = nullptr;
       g_device->QueryInterface(IID_PPV_ARGS(&dxgi_dev));
       IDXGIAdapter* adapter = nullptr;
       dxgi_dev->GetAdapter(&adapter);
       IDXGIFactory2* factory = nullptr;
       adapter->GetParent(IID_PPV_ARGS(&factory));
       DXGI_SWAP_CHAIN_DESC1 sd = {};
       sd.Width = (UINT)w; sd.Height = (UINT)h;
       sd.Format = DXGI_FORMAT_B8G8R8A8_UNORM;
       sd.SampleDesc.Count = 1;
       sd.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
       sd.BufferCount = 2;
       sd.SwapEffect = DXGI_SWAP_EFFECT_FLIP_SEQUENTIAL;
       sd.AlphaMode = DXGI_ALPHA_MODE_IGNORE;
       sd.Scaling = DXGI_SCALING_STRETCH;
```

```
       // CreateSwapChainForHwnd (SEM DComp!)
       factory->CreateSwapChainForHwnd(g_device, hwnd, &sd, nullptr, nullptr,
                                       (IDXGISwapChain1**)&g_swap_chain);
       factory->Release(); adapter->Release(); dxgi_dev->Release();
       return CreateRenderTarget();
   }
```

```
   //=== INICIALIZAR IMGUI ===
   bool InitImGui(HWND hwnd) {
       ImGui::CreateContext();
       ImGuiIO& io = ImGui::GetIO();
       io.IniFilename = nullptr;  // sem .ini
       io.LogFilename = nullptr;
       io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
       if (!ImGui_ImplWin32_Init(hwnd)) return false;
       if (!ImGui_ImplDX11_Init(g_device, g_context)) return false;
       io.Fonts->AddFontDefault();  // Fonte PADRAO embutida
       ImGui_ImplDX11_CreateDeviceObjects();
       return true;
   }
```

```
   //=== RENDER FRAME ===
   void RenderFrame() {
       ImGui_ImplDX11_NewFrame();
       ImGui_ImplWin32_NewFrame();
       ImGui::NewFrame();
       // --- SEUS WIDGETS AQUI ---
       ImGui::Begin("Minha Janela", nullptr,
                    ImGuiWindowFlags_AlwaysAutoResize);
       ImGui::Text("Ola, mundo! Projeto minimo ImGui.");
       ImGui::Text("FPS: %.1f", ImGui::GetIO().Framerate);
       if (ImGui::Button("Clique")) {
           MessageBoxA(g_hwnd, "Clicou!", "Info", MB_OK);
       }
       static float v = 50.0f;
       ImGui::SliderFloat("Slider", &v, 0, 100);
       static bool chk = false;
       ImGui::Checkbox("Check", &chk);
       static int item = 0;
       ImGui::Combo("Combo", &item, "A\0B\0C\0");
       ImGui::Text("%.3f ms (%.1f FPS)", 1000.0f/ImGui::GetIO().Framerate,
                   ImGui::GetIO().Framerate);
       ImGui::End();
       ImGui::Render();
       const float clear[4] = { 0.1f, 0.1f, 0.12f, 1.0f };
       g_context->OMSetRenderTargets(1, &g_rtv, nullptr);
       g_context->ClearRenderTargetView(g_rtv, clear);
       ImGui_ImplDX11_RenderDrawData(ImGui::GetDrawData());
       g_swap_chain->Present(1, 0);  // VSync
   }
   //=== WNDPROC ===
   LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp) {
       if (ImGui_ImplWin32_WndProcHandler(hwnd, msg, wp, lp))
           return true;
       switch (msg) {
       case WM_SIZE:
           if (g_swap_chain && wp != SIZE_MINIMIZED) {
               g_context->OMSetRenderTargets(1, &g_rtv, nullptr);
               if (g_rtv) { g_rtv->Release(); g_rtv = nullptr; }
               g_swap_chain->ResizeBuffers(0, LOWORD(lp), HIWORD(lp),
                                           DXGI_FORMAT_UNKNOWN, 0);
               CreateRenderTarget();
           }
           return 0;
       case WM_DESTROY:
           PostQuitMessage(0);
           return 0;
       }
       return DefWindowProc(hwnd, msg, wp, lp);
   }
   //=== WINMAIN ===
   int WINAPI WinMain(HINSTANCE inst, HINSTANCE, LPSTR, int) {
       WNDCLASSEXW wc = {};
       wc.cbSize = sizeof(WNDCLASSEXW);
       wc.style = CS_CLASSDC;
       wc.lpfnWndProc = WndProc;
       wc.hInstance = inst;
       wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
       wc.lpszClassName = L"MinimaImGui";
       RegisterClassExW(&wc);
```

```
       g_hwnd = CreateWindowExW(0, wc.lpszClassName, L"Minimo ImGui",
           WS_OVERLAPPEDWINDOW, 100, 100, 1280, 720,
           nullptr, nullptr, inst, nullptr);
       ShowWindow(g_hwnd, SW_SHOWDEFAULT);
       UpdateWindow(g_hwnd);
       if (!InitD3D11(g_hwnd, 1280, 720)) return 1;
       if (!InitImGui(g_hwnd)) return 1;
       MSG msg = {};
       while (msg.message != WM_QUIT) {
           if (PeekMessage(&msg, nullptr, 0, 0, PM_REMOVE)) {
               TranslateMessage(&msg);
               DispatchMessage(&msg);
               continue;
           }
           RenderFrame();
       }
       ImGui_ImplDX11_Shutdown();
       ImGui_ImplWin32_Shutdown();
       ImGui::DestroyContext();
       if (g_rtv) g_rtv->Release();
       if (g_swap_chain) g_swap_chain->Release();
       if (g_context) g_context->Release();
       if (g_device) g_device->Release();
       DestroyWindow(g_hwnd);
       UnregisterClassW(wc.lpszClassName, wc.hInstance);
       return 0;
   }
```

```
34.7 - Explicacao de Cada Bloco do Codigo
```

```
--------------------------------------------
BLOCO 0 - INCLUDES: windows.h (Win32), d3d11.h/dxgi1_2.h (DX11),
   imgui.h + backends (ImGui). Sem dcomp.h ou dwmapi.h.
```

```
BLOCO 1 - CreateRenderTarget():
   Obtem backbuffer via GetBuffer(0) e cria ID3D11RenderTargetView.
   Necessario para renderizar na tela.
```

```
BLOCO 2 - InitD3D11():
   a) D3D11CreateDevice: cria GPU device + context
   b) QueryInterface para IDXGIFactory2
   c) DXGI_SWAP_CHAIN_DESC1 descreve a swap chain
   d) CreateSwapChainForHwnd (NORMAL) - DIFERENTE do Splinter que
      usa CreateSwapChainForComposition (DComp)
   e) CreateRenderTarget() para criar RTV
```

```
BLOCO 3 - InitImGui():
   a) CreateContext() cria contexto global
   b) Configura IO (sem .ini, navegacao teclado)
   c) Init backends (Win32 + DX11)
   d) AddFontDefault() - fonte ProggyClean 13px EMBUTIDA
   e) CreateDeviceObjects() - textura do atlas na GPU
```

```
BLOCO 4 - RenderFrame():
   a) NewFrame (3 chamadas): prepara o frame
   b) Widgets dentro de Begin/End: Text, Button, Slider, Checkbox, Combo
   c) Render() finaliza frame
   d) ClearRenderTargetView + RenderDrawData + Present
```

```
BLOCO 5 - WndProc:
   Chama ImGui_ImplWin32_WndProcHandler para processar input.
```

```
   Trata WM_SIZE (redimensionar swap chain) e WM_DESTROY (sair).
```

```
BLOCO 6 - WinMain:
```

```
   Registra classe, cria janela (WS_OVERLAPPEDWINDOW), inicia D3D11
   e ImGui, loop de mensagens, cleanup.
```

# `34.8 - Como Compilar e Executar` 

```
-----------------------------------
```

`1. Crie projeto VS Console Application vazio` 

`2. Copie nucleo ImGui para ext/imgui/` 

`3. Copie main.cpp acima` 

`4. Adicione ao projeto: imgui.cpp, imgui_widgets.cpp, imgui_draw.cpp, imgui_tables.cpp, imgui_impl_win32.cpp, imgui_impl_dx11.cpp, main.cpp` 

`5. Configure:` 

- `Include: ext/imgui; ext/imgui/backends` 

- `Defines: NOMINMAX; WIN32_LEAN_AND_MEAN` 

- `C++ Standard: C++17` 

- `Linker: d3d11.lib; dxgi.lib` 

`6. Compile (F7) e execute (F5)` 

# `34.9 - Resumo` 

- `---------------` 

- `main.cpp minimo funcional com ~160 linhas` 

- `WS_OVERLAPPEDWINDOW (janela com bordas)` 

- `CreateSwapChainForHwnd (sem DComp)` 

- `AddFontDefault (sem TTF externo)` 

- `Apenas d3d11.lib + dxgi.lib` 

- `Sem FreeType, DComp, acrylic, temas customizados` 

