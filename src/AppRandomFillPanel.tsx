import React, { useMemo, useRef } from 'react';
import './App.css';
import { TreeTableVM } from './ViewModels/TreeTableVM';


const AppRandomFillPanel: React.FC<{ treeModel: TreeTableVM, treeModelArray:any[] }> = ({ ...props })=>
{
    const { treeModel, treeModelArray } = props;
    const idRef = useRef<HTMLInputElement>(null);
    const parentIdRef = useRef<HTMLInputElement>(null);
    const randomMaxParentIdRef = useRef<HTMLInputElement>(null);
    let counter = useRef(0);
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
            treeModelArray.push({ Id: idRef.current!.valueAsNumber, ParentId: parentIdRef.current!.valueAsNumber });
            idRef.current!.valueAsNumber++;
        }
        treeModel.NotifyDataSourceWasChanged();
    }
    return (
            <div >
                Id=<input type="number" ref={idRef} placeholder="Id" defaultValue="0" />
                <input type="number" ref={parentIdRef} placeholder="parentId" />
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
    );
}

export default AppRandomFillPanel;
