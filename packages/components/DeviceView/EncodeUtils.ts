


import H264Parser from 'h264-converter/dist/h264-parser';




type ParametersSubSet = {
    codec: string;
    width: number;
    height: number;
};



function toHex(value: number) {
    return value.toString(16).padStart(2, '0').toUpperCase();
}



export function parseSPS(data: Uint8Array): ParametersSubSet {
    const {
        profile_idc,
        constraint_set_flags,
        level_idc,
        pic_width_in_mbs_minus1,
        frame_crop_left_offset,
        frame_crop_right_offset,
        frame_mbs_only_flag,
        pic_height_in_map_units_minus1,
        frame_crop_top_offset,
        frame_crop_bottom_offset,
        sar,
    } = H264Parser.parseSPS(data);

    const sarScale = sar[0] / sar[1];
    const codec = `avc1.${[profile_idc, constraint_set_flags, level_idc].map(toHex).join('')}`;
    const width = Math.ceil(
        ((pic_width_in_mbs_minus1 + 1) * 16 - frame_crop_left_offset * 2 - frame_crop_right_offset * 2) * sarScale,
    );
    const height =
        (2 - frame_mbs_only_flag) * (pic_height_in_map_units_minus1 + 1) * 16 -
        (frame_mbs_only_flag ? 2 : 4) * (frame_crop_top_offset + frame_crop_bottom_offset);
    return { codec, width, height };
}


export function isIFrame(frame: Uint8Array): boolean {
    // last 5 bits === 5: Coded slice of an IDR picture

    // https://www.ietf.org/rfc/rfc3984.txt
    // 1.3.  Network Abstraction Layer Unit Types
    // https://www.itu.int/rec/T-REC-H.264-201906-I/en
    // Table 7-1 – NAL unit type codes, syntax element categories, and NAL unit type classes
    return frame && frame.length > 4 && (frame[4] & 31) === 5;
}