import { useEffect, useState } from "react";
import VM_Base from "../ViewModels/VM_Base";

/** 
 *  Set 'RenderCallback' open unsafe field '()=>void', which mark React re-render DOM.
 *  */
export default function useRenderCallbackVM(vm: VM_Base)
{
    const [, setRenderTrigger] = useState({});
    useEffect(() => { vm.RenderCallback = () => setRenderTrigger({}); }, []);
};

