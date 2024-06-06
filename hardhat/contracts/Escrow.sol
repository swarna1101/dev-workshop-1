// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Escrow is Initializable {
    using SafeERC20 for IERC20;
    bool private initialized;

    address public client;
    address public talent;
    address public resolver;

    uint256 public fee = 1500;


    event Confirmed(address from, address token, uint256 amount, uint8 vote);
    event Released(
        address from,
        address to,
        address token,
        uint256 amount,
        string note
    );
    event Refunded(
        address from,
        address to,
        address token,
        uint256 amount,
        string note
    );
    event Deposit(
        address from,
        address to,
        address token,
        uint256 amount,
        string note
    );

    function init(
        address _client,
        address _provider,
        address _resolver,
        uint256 _fee
    ) external payable initializer {
        require(_client != address(0), "Client address required");
        require(_provider != address(0), "Provider address required");
        require(_resolver != address(0), "Resolver address required");
        require(_fee < 10000, "Fee must be a value of 0 - 99999");
        client = _client;
        talent = _provider;
        resolver = _resolver;

        fee = _fee;

        initialized = true;
    }

    modifier onlyParty() {
        require(
            msg.sender == client ||
                msg.sender == talent ||
                msg.sender == resolver,
            "Sender not part of party"
        );
        _;
    }

    modifier onlyResolver() {
        require(
                msg.sender == resolver,
            "Sender not resolver"
        );
        _;
    }
    modifier onlyInitialized() {
        require(initialized, "Escrow must be initialized");
        _;
    }

    /// @notice Deposit ERC20 tokens
    /// @param _token ERC20 address to token to be transferred
    /// @param _amount Amount of tokens to transfer
    /// @param _note Note about the deposit
    function deposit(
        address _token,
        uint256 _amount,
        string memory _note
    ) external onlyInitialized {
        require(_amount > fee, "Amount is too less");
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        emit Deposit(msg.sender, talent, _token, _amount, _note);
    }

    /// @notice Refunds tokens to client
    function refund(
        address _token,
        string memory _note
    ) external onlyResolver onlyInitialized {
        uint256 _amount = IERC20(_token).balanceOf(address(this));
        require(_amount > 0, "No funds :)");
        IERC20(_token).safeTransfer(resolver, fee);
        IERC20(_token).safeTransfer(client, _amount - fee);

        emit Refunded(msg.sender, client, _token, _amount, _note);
    }

    /// @notice Releases tokens to talent and 15% to resolver
    function release(
        address _token,
        string memory _note
    ) public onlyResolver onlyInitialized {
        uint256 _amount = IERC20(_token).balanceOf(address(this));
        require(_amount > 0, "No funds :)");
        IERC20(_token).safeTransfer(resolver, fee);
        IERC20(_token).safeTransfer(talent, _amount - fee);

        emit Released(msg.sender, talent, _token, _amount, _note);
    }

}
