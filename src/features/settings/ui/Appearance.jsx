function Appearance(){
    return (<>
        <section className="flex FY-center F-space">
            <div className="icon">
                ii
            </div>

            <section className="details">
                <div className="name">Theme</div>
                <div className="gray">{mode} mode is active</div>
            </section>

            <button className="changeMode">Switch to Dark or Light</button>
        </section>
        </>)
}