/*    --Project plan--
 Step 1 ---
  1. load document (pdf,excel etc) -----done
  2. create chunking  ------------------done
  3. embbed chunks and store to vector Db
 Step 2 ---
  1. setup llm
  2. retrieve 
  3. pass user query + related info to LLm
  4. done
*/

import { documentEmbedding } from "./prep_data.js";

const data = "./dbms_notes.pdf";
documentEmbedding(data);
