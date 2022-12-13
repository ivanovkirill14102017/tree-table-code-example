import { useMemo } from 'react';
import './App.css';
import { UC_TreeTable } from './Components/UC_TreeTable';
import { TreeTableVM } from './ViewModels/TreeTableVM';
import { UC_TreeTableColumn } from './Components/UC_TreeTableColumn';
import AppRandomFillPanel from './AppRandomFillPanel';

function App()
{
    const treeModelArray = useMemo((): any[] => [], []);
    const treeModel = useMemo(() => new TreeTableVM().SetDataSource(treeModelArray, "Id", "ParentId"), []);
    return (
        <div className="App">
            <AppRandomFillPanel treeModel={treeModel} treeModelArray={treeModelArray} />
            <UC_TreeTable model={treeModel} >
                <UC_TreeTableColumn Width="auto" FieldName="Id" />
                <UC_TreeTableColumn Width="250px" FieldName="ParentId" />
            </UC_TreeTable>
        </div>
    );
}

export default App;
