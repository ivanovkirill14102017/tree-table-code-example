
/** Contain 'RenderCallback' and other possible shared properties for VMs. 
    Содержит 'RenderCallback' и другие возможные общие свойства/методы для всех ВМ. */
export default abstract class VM_Base
{
    /** Input associated Component to VirtualDOM Scheduler. 
     *  При вызове помещает компонент в палнировщик.
     * Use hook 'useRenderCallbackVM'. */
    public RenderCallback = () => { };
};
