export const ActiveBookSvg = () => {
  return (
    <svg width="42" height="34" viewBox="0 0 42 34" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5113 8.14018C17.6919 6.13294 15.0298 4.86694 12.0641 4.86694H3.72348C1.66706 4.86694 0 6.4901 0 8.49237V25.765C0 27.7673 1.66591 29.3905 3.72233 29.3905H11.5676C15.368 29.3905 16.3025 30.366 17.2063 31.3095C17.9272 32.062 18.6285 32.7942 20.749 32.9948C20.853 33.0046 20.9541 33.0002 21.0509 32.9832C21.1152 32.9865 21.1811 32.984 21.2481 32.9753C22.8488 32.7667 23.5467 32.142 24.2865 31.4799C25.3402 30.5367 26.4787 29.5177 30.4323 29.5177H38.2776C40.3341 29.5177 42 27.8945 42 25.8923V8.49236C42 6.4901 40.3329 4.86694 38.2765 4.86694H29.9359C26.9709 4.86694 24.3095 6.13229 22.4901 8.13863V26.2959C22.2659 26.4645 22.0336 26.6186 21.769 26.7459C21.5866 26.9583 21.3098 27.0806 21.0034 27.0308C20.9797 27.027 20.9563 27.023 20.9332 27.0189C20.7276 27.0465 20.5368 26.9915 20.3824 26.8822C20.0419 26.7707 19.7625 26.6235 19.5113 26.4552V8.14018Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.11316 3.90058C5.11316 2.29877 6.44681 1.00024 8.09194 1.00024H14.0495C17.04 1.00024 19.6446 2.60928 20.9997 4.9867C20.9997 4.9868 20.9996 4.9869 20.9995 4.987C20.6032 4.29157 20.0999 3.66189 19.5113 3.11898V26.4549C19.2475 26.2781 19.0148 26.0781 18.7751 25.8721C17.8556 25.0819 16.8328 24.2029 13.5531 24.2029H8.09083C6.44569 24.2029 5.11316 22.9044 5.11316 21.3026V3.90058ZM21.5861 26.9072C21.6541 26.8626 21.7157 26.8081 21.7691 26.7458C22.2102 26.5336 22.5617 26.247 22.9349 25.9427C23.9252 25.1353 25.0687 24.2029 28.4465 24.2029H33.9087C35.5538 24.2029 36.8864 22.9044 36.8864 21.3026V3.90058C36.8864 2.29877 35.5527 1.00024 33.9076 1.00024H27.95C25.8352 1.00024 23.9135 1.80489 22.4901 3.1169V26.2959C22.2659 26.4645 22.0336 26.6186 21.769 26.7459C21.7156 26.8081 21.6541 26.8626 21.5861 26.9072Z"
        fill="white"
      />
      <path
        opacity="0.4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5113 3.11898C20.0999 3.66189 20.6032 4.29157 20.9995 4.987C21.3964 4.29065 21.9005 3.66022 22.4901 3.11682V26.2959C22.2659 26.4645 22.0336 26.6186 21.769 26.7459C21.5866 26.9583 21.3098 27.0806 21.0034 27.0308C20.9797 27.027 20.9563 27.023 20.9332 27.0189C20.7276 27.0465 20.5368 26.9915 20.3824 26.8822C20.0419 26.7707 19.7625 26.6235 19.5113 26.4552V3.11898Z"
        fill="white"
      />
    </svg>
  );
};

export const TileIcon = ({ tileType, status }) => {
  return <ActiveBookSvg />;
  const cover =
    status === "COMPLETE"
      ? "#F8C537"
      : status === "ACTIVE"
      ? "#4F7DF5"
      : "#7C8899";
  const spine =
    status === "COMPLETE"
      ? "#E0AC10"
      : status === "ACTIVE"
      ? "#2E5DBF"
      : "#5C6673";
  const page = "#FFFFFF";
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Book"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="8" width="18" height="48" rx="2" fill={spine} />
      <path d="M28 8h22a4 4 0 0 1 4 4v40a4 4 0 0 0-4-4H28V8Z" fill={cover} />
      <path d="M28 12h19a2 2 0 0 1 2 2v28a2 2 0 0 0-2-2H28V12Z" fill={page} />
      <path
        d="M14 16h10M14 22h10M14 28h10"
        stroke={page}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {status === "COMPLETE" && (
        <path
          d="M34 38.5 38.5 43l9-10"
          fill="none"
          stroke="#1F6F3F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {status === "ACTIVE" && (
        <circle
          cx="48"
          cy="18"
          r="5"
          fill="#FFFFFF"
          stroke={spine}
          strokeWidth="2"
        />
      )}
      {status !== "COMPLETE" && status !== "ACTIVE" && (
        <path
          d="M44 18c0-2 1.5-3 3-3s3 1 3 3-1 3-3 3"
          fill="none"
          stroke={spine}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
  // switch (tileType) {
  //   case "star":
  //     return status === "COMPLETE" ? (
  //       <CheckmarkSvg />
  //     ) : status === "ACTIVE" ? (
  //       <StarSvg />
  //     ) : (
  //       <LockSvg />
  //     );
  //   case "book":
  //     return status === "COMPLETE" ? (
  //       <GoldenBookSvg />
  //     ) : status === "ACTIVE" ? (
  //       <ActiveBookSvg />
  //     ) : (
  //       <LockedBookSvg />
  //     );
  //   case "dumbbell":
  //     return status === "COMPLETE" ? (
  //       <GoldenDumbbellSvg />
  //     ) : status === "ACTIVE" ? (
  //       <ActiveDumbbellSvg />
  //     ) : (
  //       <LockedDumbbellSvg />
  //     );
  //   case "fast-forward":
  //     return status === "COMPLETE" ? (
  //       <CheckmarkSvg />
  //     ) : status === "ACTIVE" ? (
  //       <StarSvg />
  //     ) : (
  //       <FastForwardSvg />
  //     );
  //   case "treasure":
  //     return status === "COMPLETE" ? (
  //       <GoldenTreasureSvg />
  //     ) : status === "ACTIVE" ? (
  //       <ActiveTreasureSvg />
  //     ) : (
  //       <LockedTreasureSvg />
  //     );
  //   case "trophy":
  //     return status === "COMPLETE" ? (
  //       <GoldenTrophySvg />
  //     ) : status === "ACTIVE" ? (
  //       <ActiveTrophySvg />
  //     ) : (
  //       <LockedTrophySvg />
  //     );
  // }
};
