import { useEffect, useState } from 'react'

export default function TimeConverter({ missionStart }: { missionStart?: string }) {
    const [time, setTime] = useState(new Date())
    const [isUtc, setIsUtc] = useState(localStorage.getItem('showMET') !== 'true');

    useEffect(() => {
        const intervalId = setInterval(() => { setTime(new Date()) }, 1000);
        return () => {
            clearInterval(intervalId);
        }
    }, [])

    function setUtcDate() {
        var field = document.aspnetForm.utc_dat;
        var utc = parseDate(field);
        updateFields(utc_to_tai(utc), field);
    }

    function setUtcDateDoy() {
        var field = document.aspnetForm.utc_doy;
        var utc = parseDoyDate(field);
        updateFields(utc_to_tai(utc), field);
    }

    return (
        <form>
            <div className="grip gap-4">
                <div>
                    <label>UTC:</label>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        Date<br />
                        <input type="text" name="utc_dat" className="form-control gps_input " maxLength={19} placeholder="yyyy-mm-dd hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onClick={setUtcDate} />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        DOY<br />
                        <input type="text" name="utc_doy" className="form-control gps_input" maxLength={17} placeholder="yyyy doy hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onClick={setUtcDateDoy} />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        secs. since 1970-01-01<br />
                        <input type="text" name="unx_sec" className="form-control gps_input" size={20} />
                        <input type="button" value="Set" className="form-control setbtn" onClick={setUtcSeconds} />
                    </div>
                </div>
                {/* <br />
                <div className="form-group" style={{ marginBottom: '2em' }}>
                    <label>GPS:</label>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        Date<br />
                        <input type="text" name="gps_dat" className="form-control gps_input" maxlength="19" placeholder="yyyy-mm-dd hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setGpsDate()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        DOY<br />
                        <input type="text" name="gps_doy" className="form-control gps_input" maxlength="17" placeholder="yyyy doy hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setGpsDateDoy()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        secs. since 1980-01-06 (no leap secs.)<br />
                        <input type="text" name="gps_sec" className="form-control gps_input" size="20" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setGpsSeconds()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        OBT (secs. since 1958-01-01, no leap secs.)<br />
                        <input type="text" name="gps_sec_1958" className="form-control gps_input" size="20" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setGpsSeconds_1958()" />
                        UTC <span id="gps_leap_cnt"></span>seconds
                    </div>
                </div>
                <br />
                <div className="form-group" style={{ marginBottom: '2em' }}>
                    <label>TAI:</label>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        Date<br />
                        <input type="text" name="tai_dat" className="form-control gps_input" maxlength="19" placeholder="yyyy-mm-dd hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setTaiDate()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        DOY<br />
                        <input type="text" name="tai_doy" className="form-control gps_input" maxlength="17" placeholder="yyyy doy hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setTaiDateDoy()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        secs. since 1958-01-01 (no leap secs.)<br />
                        <input type="text" name="tai_sec" className="form-control gps_input" size="20" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setTaiSeconds()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        UTC <span id="tai_leap_cnt"></span>seconds
                    </div>
                </div> */}
                <br />
                <div className="form-group">
                    <label>MET:</label>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        Days<br />
                        <input type="text" name="met" className="form-control gps_input" size="20" placeholder="±dddd hh:mm:ss" />
                        <input type="button" value="Set" className="form-control setbtn" onclick="setMetDate()" />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        Launch date<br />
                        <asp:TextBox runat="server" Enabled="false" ID="txtLaunchDate" CssClass="form-control" />
                        <input type="button" className="form-control btn-default" style={{ visibility: 'hidden' }} />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        <input type="button" value="Start ticking" className="form-control btn-default" id="btnStartStop" style={{ margin- right: 0 }} />
                    </div>
                    <div style={{ display: 'inline-block', width: 'auto' }}>
                        <input type="button" value="Now" className="form-control setbtn btn-primary" onclick="setCurrentTime()" />
                    </div>
                </div>
                <br />
            </div>
        </form>
    );
}
