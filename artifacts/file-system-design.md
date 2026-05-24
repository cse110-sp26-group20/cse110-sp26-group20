# File System
## Background
Given that the image feature involves multiple different pages and spans across various functions, it is necessary to implement a class design capable of handling `file upload`, `template library`, and `editor` to fulfill this requirement.

To address this problem, we could invoke a file system design with a `file ID`. Therefore, the file system can be effectively managed via IDs, as long as the uniqueness of each ID is ensured.

## Load Template at Startup
First, regarding the template library: due to concerns about API call limits and response times, I decided to **load the template images directly into memory** during project startup. Below is the BOOTSTRAP flowchart illustrating this process.
```mermaid
flowchart TB
    %% Styling Definitions
    classDef startEnd fill:#f9f,stroke:#333,stroke-width:2px;
    classDef process fill:#bbf,stroke:#333,stroke-width:2px;
    classDef shared fill:#ff9,stroke:#e6a23c,stroke-width:3px,stroke-dasharray: 5 5;

    subgraph Shared [Shared Instances - Initialized on Boot]
        direction LR
        FR[("FileRepository\n(In-Memory Map & Disk)")]:::shared
        GM[("Global Template Memory\n(Cache for Template Library)")]:::shared
    end

    B1((Start Bootstrapping)):::startEnd --> B2[Fetch Data from Imgflip API]:::process
    B2 --> B3[Process & Download Images]:::process
    B3 --> B4[Package IDs & URLs]:::process
    B4 --> B5((End Bootstrapping)):::startEnd

    %% Dependencies / Data Flow
    B3 -. Save img & metadata .-> FR
    B4 -. Save Template IDs .-> GM
```
## Template Library
Since the data is **already loaded into memory** during program startup, the Template Library simply needs to read the corresponding information directly from memory and return it to the frontend.
```mermaid
flowchart TB
    %% Styling Definitions
    classDef startEnd fill:#f9f,stroke:#333,stroke-width:2px;
    classDef process fill:#bbf,stroke:#333,stroke-width:2px;
    classDef shared fill:#ff9,stroke:#e6a23c,stroke-width:3px,stroke-dasharray: 5 5;

    subgraph SharedResources [Shared Storage / Memory]
        direction TB
        FR[("FileRepository")]:::shared
        GM[("Global Template Memory\n(Imgflip ID Cache)")]:::shared
    end
    subgraph Template [Template Library Flow]
        direction TB
        T1((Template API\nRequest)):::startEnd --> T2[Execute getImgTemplate]:::process
        T2 --> T3[Return Template Data]:::process
        T3 --> T4((End Request)):::startEnd
    end

    T2 -. Read available templates .-> GM

    Editor -. Query local path .-> FR
    Upload -. Save file & metadata .-> FR
```
## FileRepository
Similarly, file reading and writing operations are handled through the `FileRepository`. 

- During a **file upload**, the file must be serialized and then saved to the file system. 
- For the Editor feature, whether dealing with a template or an uploaded file, it simply uses the `file ID` to locate the corresponding file via the **FileRepository**. Note: *The editor functionality described here is designed exclusively for the **file system** and does NOT include the AI Generator component.*

```mermaid
flowchart TB
    %% Styling Definitions
    classDef startEnd fill:#f9f,stroke:#333,stroke-width:2px;
    classDef process fill:#bbf,stroke:#333,stroke-width:2px;
    classDef shared fill:#ff9,stroke:#e6a23c,stroke-width:3px,stroke-dasharray: 5 5;

    subgraph Upload [Upload Flow]
        direction TB
        U1((Client Upload)):::startEnd --> U2[Parse File Stream]:::process
        U2 --> U3[Process File]:::process
        U3 --> U4((End Upload)):::startEnd
    end
    
    subgraph Editor [Editor Flow]
        direction TB
        E1((API GET\n/images/:id)):::startEnd --> E2[Extract ID]:::process
        E2 --> E3[Return File Stream]:::process
        E3 --> E4((End Request)):::startEnd
    end

    U3 -. Save file & metadata .-> FR
    E2 -. Query local path .-> FR

    subgraph SharedResources [Shared Storage / Memory]
        direction TB
        FR[("FileRepository\n(In-Memory Map & Disk)")]:::shared
        GM[("Cache")]:::shared
    end

    TemplateLibrary -. Read available templates .-> GM
```