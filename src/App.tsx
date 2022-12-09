import React, { FC, useMemo, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { UC_TreeTable} from './Components/UC_TreeTable';
import { TreeTableVM } from './ViewModels/TreeTableVM';
import { UC_TreeTableColumn } from './Components/UC_TreeTableColumn';


function App()
{
    const idRef = useRef<HTMLInputElement>(null);
    const parentidRef = useRef<HTMLInputElement>(null);
    const randomMaxParentIdRef = useRef<HTMLInputElement>(null);
    let counter = useRef(0);
    const treeModelArray = useMemo((): any[] => [], []);
    const treeModel = useMemo(() => new TreeTableVM().SetDataSource(treeModelArray, "Id", "ParentId"), []);
    function addrandom(count: number)
    {
        for (var i = 0; i < count; i++)
        {
            let id = counter.current++;
            let parentId: number | null = Math.round(Math.random() * randomMaxParentIdRef.current?.valueAsNumber!);
            if (parentId == id)
                parentId = null;
            treeModelArray.push({ Id: id, ParentId: parentId });
        }
        treeModel.NotifyDataSourceWasChanged();
    }
    function addexact(count: number)
    {
        for (var i = 0; i < count; i++)
        {
            counter.current++;
            treeModelArray.push({ Id: idRef.current!.valueAsNumber, ParentId: parentidRef.current!.valueAsNumber });
            idRef.current!.valueAsNumber++;
        }
        treeModel.NotifyDataSourceWasChanged();
    }
    return (
        <div className="App">
            <div style={{ border: "2px", borderColor: "#888" }}>
                Id=<input type="number" ref={idRef} placeholder="Id" defaultValue="0" />
                <input type="number" ref={parentidRef} placeholder="parentId" />
                <input type="button" value="add 1 exact" onClick={() => addexact(1)} />
                <input type="button" value="add 10 exact" onClick={() => addexact(10)} />
                <input type="button" value="add 1000 exact" onClick={() => addexact(1000)} />
                <p />
                randomMaxParentId=
                <input type="number" ref={randomMaxParentIdRef} placeholder="randomMaxParentId" defaultValue="100" />
                <input type="button" value="add 1 random" onClick={() => addrandom(1)} />
                <input type="button" value="add 10 random" onClick={() => addrandom(10)} />
                <input type="button" value="add 1000 random" onClick={() => addrandom(1000)} />
                <input type="button" value="add 50000 random" onClick={() => addrandom(50000)} />
            </div>
            <UC_TreeTable model={treeModel} >
                <UC_TreeTableColumn Width="auto" FieldName="Id" />
                <UC_TreeTableColumn Width="250px" FieldName="ParentId" />
            </UC_TreeTable>
        </div>
    );
}

export default App;
