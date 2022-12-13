
/** Contain 'RenderCallback' and other possible shared properties for VMs.  */
export default abstract class VM_Base
{
    /** Input associated Component to VirtualDOM Scheduler. 
     * Use hook 'useRenderCallbackVM'. */
    public RenderCallback = () => { };
};
